import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, PenTool, Trash2, GripVertical } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { z } from 'zod';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  category: z.enum(['frontend', 'backend', 'framework', 'database', 'aiml', 'tools'], { required_error: 'Category is required' }),
  percentage: z.number().min(0).max(100, 'Percentage must be between 0 and 100'),
});

interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'framework' | 'database' | 'aiml' | 'tools';
  percentage: number;
  sort_order: number;
}

interface SkillsManagerProps {
  userId?: string;
}

interface SortableSkillItemProps {
  skill: Skill;
  onEdit: (skill: Skill) => void;
  onDelete: (id: string) => void;
}

interface SortableCategorySectionProps {
  category: string;
  label: string;
  skills: Skill[];
  onEdit: (skill: Skill) => void;
  onDelete: (id: string) => void;
  sensors: any;
  handleDragEnd: (event: DragEndEvent) => void;
}

function SortableCategorySection({ 
  category, 
  label, 
  skills, 
  onEdit, 
  onDelete, 
  sensors, 
  handleDragEnd 
}: SortableCategorySectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`${isDragging ? 'shadow-lg z-50' : ''}`}
    >
      <CardHeader className="relative">
        {/* Category Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-4 right-4 cursor-grab active:cursor-grabbing p-2 hover:bg-muted/50 rounded-lg transition-colors duration-200"
          title="Drag to reorder categories"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <CardTitle>{label}</CardTitle>
        <CardDescription>
          {skills.length} skills
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={skills.map(s => s.id)} strategy={verticalListSortingStrategy}>
            <div className="grid gap-3">
              {skills.map((skill) => (
                <SortableSkillItem
                  key={skill.id}
                  skill={skill}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              )) || (
                <p className="text-muted-foreground text-center py-4">
                  No {label.toLowerCase()} skills yet
                </p>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
}

function SortableSkillItem({ skill, onEdit, onDelete }: SortableSkillItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: skill.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`flex items-center justify-between p-3 border rounded ${isDragging ? 'shadow-lg' : ''}`}
    >
      <div className="flex items-center gap-3 flex-1">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium">{skill.name}</span>
            <span className="text-sm text-muted-foreground">{skill.percentage}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${skill.percentage}%` }}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-2 ml-4">
        <Button variant="outline" size="sm" onClick={() => onEdit(skill)}>
          <PenTool className="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(skill.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function SkillsManager({ userId }: SkillsManagerProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'frontend' as 'frontend' | 'backend' | 'framework' | 'database' | 'aiml' | 'tools',
    percentage: 0,
  });
  const { toast } = useToast();

  // Category order state
  const [categoryOrder, setCategoryOrder] = useState([
    'frontend',
    'backend',
    'framework',
    'database',
    'aiml',
    'tools'
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (userId) {
      fetchSkills();
    }
  }, [userId]);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', userId)
        .order('category', { ascending: true })
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setSkills((data || []) as Skill[]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load skills",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'frontend',
      percentage: 0,
    });
    setEditingSkill(null);
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      percentage: skill.percentage,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      skillSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    try {
      const categorySkills = skills.filter(s => s.category === formData.category);
      const skillData = {
        name: formData.name,
        category: formData.category,
        percentage: formData.percentage,
        user_id: userId,
        sort_order: editingSkill ? editingSkill.sort_order : categorySkills.length,
      };

      if (editingSkill) {
        const { error } = await supabase
          .from('skills')
          .update(skillData)
          .eq('id', editingSkill.id);

        if (error) throw error;
        
        toast({
          title: "Success!",
          description: "Skill updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('skills')
          .insert(skillData);

        if (error) throw error;
        
        toast({
          title: "Success!",
          description: "Skill added successfully",
        });
      }

      setDialogOpen(false);
      resetForm();
      fetchSkills();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Skill deleted successfully",
      });
      
      fetchSkills();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = skills.findIndex((skill) => skill.id === active.id);
      const newIndex = skills.findIndex((skill) => skill.id === over?.id);

      const newSkills = arrayMove(skills, oldIndex, newIndex);
      setSkills(newSkills);

      // Update sort_order in database
      try {
        const updates = newSkills.map((skill, index) => ({
          id: skill.id,
          sort_order: index,
        }));

        for (const update of updates) {
          const { error } = await supabase
            .from('skills')
            .update({ sort_order: update.sort_order })
            .eq('id', update.id);

          if (error) throw error;
        }

        toast({
          title: "Success!",
          description: "Skill order updated successfully",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to update skill order",
          variant: "destructive",
        });
        // Revert the local state on error
        fetchSkills();
      }
    }
  };

  const handleCategoryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setCategoryOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over?.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categoryLabels = {
    frontend: 'Frontend',
    backend: 'Backend',
    framework: 'Frameworks',
    database: 'Database',
    aiml: 'AI/ML',
    tools: 'Tools & Others'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Skills</h2>
          <p className="text-muted-foreground">Manage your technical skills and expertise</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </DialogTitle>
              <DialogDescription>
                Fill in the skill details below
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Skill Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="React"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: 'frontend' | 'backend' | 'framework' | 'database' | 'aiml' | 'tools') => 
                    setFormData(prev => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend">Frontend</SelectItem>
                    <SelectItem value="backend">Backend</SelectItem>
                    <SelectItem value="framework">Frameworks</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="aiml">AI/ML</SelectItem>
                    <SelectItem value="tools">Tools & Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="percentage">Proficiency Level (%)</Label>
                <Input
                  id="percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.percentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, percentage: parseInt(e.target.value) || 0 }))}
                  placeholder="90"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSkill ? 'Update Skill' : 'Add Skill'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading skills...</div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleCategoryDragEnd}
        >
          <SortableContext items={categoryOrder} strategy={verticalListSortingStrategy}>
            <div className="space-y-6">
              {categoryOrder.map((category) => (
                <SortableCategorySection
                  key={category}
                  category={category}
                  label={categoryLabels[category as keyof typeof categoryLabels]}
                  skills={groupedSkills[category] || []}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  sensors={sensors}
                  handleDragEnd={handleDragEnd}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}