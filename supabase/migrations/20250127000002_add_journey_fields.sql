-- Add journey fields to portfolio_info table
ALTER TABLE public.portfolio_info
ADD COLUMN journey_title TEXT DEFAULT 'My Journey',
ADD COLUMN journey_content TEXT DEFAULT 'Started as a curious student exploring the world of programming, I''ve evolved into a full-stack developer who loves turning complex problems into simple, beautiful, and intuitive solutions.

When I''m not coding, you can find me exploring new technologies, contributing to open source projects, or sharing knowledge with the developer community.',
ADD COLUMN journey_technologies TEXT DEFAULT 'React, TypeScript, Node.js, Python, AWS';
