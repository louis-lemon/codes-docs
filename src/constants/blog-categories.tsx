import {
  BrainCircuit,
  Calendar,
  Code,
  Monitor,
  Server,
  Smartphone,
  TrendingUp,
  DollarSign,
  Users,
  Briefcase,
  Palette,
  Paintbrush,
  Layers,
  FileSearch,
  BarChart3,
  Target,
  BookOpen,
  Lightbulb,
  PenTool,
  GitBranch,
  Settings,
  Building
} from "lucide-react"

export const categoryInfo = {
  // Main Categories
  'Technology': { name: 'Technology', icon: <Monitor className="h-5 w-5" />, description: 'Technical articles covering frontend, backend, DevOps, mobile development, and AI/ML topics.' },
  'Business': { name: 'Business', icon: <Building className="h-5 w-5" />, description: 'Business insights including strategy, marketing, sales, finance, and HR topics.' },
  'Design': { name: 'Design', icon: <Palette className="h-5 w-5" />, description: 'Design-focused content covering UI/UX, branding, graphics, and prototyping.' },
  'Research': { name: 'Research', icon: <FileSearch className="h-5 w-5" />, description: 'Research articles including user studies, market analysis, competitive research, and academic content.' },
  'Blog': { name: 'Blog', icon: <BookOpen className="h-5 w-5" />, description: 'Personal blog posts including guides, notes, ideas, and learning content.' },

  // Technology Subcategories
  'Frontend': { name: 'Frontend', icon: <Monitor className="h-5 w-5" />, description: 'Frontend development topics including React, Vue, Angular, and modern web technologies.' },
  'Backend': { name: 'Backend', icon: <Server className="h-5 w-5" />, description: 'Backend development covering APIs, databases, server architecture, and system design.' },
  'DevOps': { name: 'DevOps', icon: <Settings className="h-5 w-5" />, description: 'DevOps practices including CI/CD, containerization, deployment, and infrastructure automation.' },
  'Mobile': { name: 'Mobile', icon: <Smartphone className="h-5 w-5" />, description: 'Mobile development for iOS, Android, and cross-platform solutions.' },
  'AI/ML': { name: 'AI/ML', icon: <BrainCircuit className="h-5 w-5" />, description: 'Artificial Intelligence and Machine Learning topics, algorithms, and implementations.' },

  // Business Subcategories
  'Strategy': { name: 'Strategy', icon: <Target className="h-5 w-5" />, description: 'Business strategy, planning, and strategic decision-making processes.' },
  'Marketing': { name: 'Marketing', icon: <TrendingUp className="h-5 w-5" />, description: 'Marketing strategies, digital marketing, content marketing, and growth tactics.' },
  'Sales': { name: 'Sales', icon: <DollarSign className="h-5 w-5" />, description: 'Sales processes, customer acquisition, and revenue generation strategies.' },
  'Finance': { name: 'Finance', icon: <BarChart3 className="h-5 w-5" />, description: 'Financial planning, budgeting, investment strategies, and financial analysis.' },
  'HR': { name: 'HR', icon: <Users className="h-5 w-5" />, description: 'Human resources, team management, recruitment, and organizational development.' },

  // Design Subcategories
  'UI/UX': { name: 'UI/UX', icon: <Layers className="h-5 w-5" />, description: 'User interface and user experience design principles, patterns, and best practices.' },
  'Branding': { name: 'Branding', icon: <Briefcase className="h-5 w-5" />, description: 'Brand identity, visual identity systems, and brand strategy development.' },
  'Graphics': { name: 'Graphics', icon: <Paintbrush className="h-5 w-5" />, description: 'Graphic design, visual communication, and creative design processes.' },
  'Prototype': { name: 'Prototype', icon: <PenTool className="h-5 w-5" />, description: 'Prototyping methods, tools, and iterative design processes.' },

  // Research Subcategories
  'User Research': { name: 'User Research', icon: <Users className="h-5 w-5" />, description: 'User research methodologies, usability testing, and user behavior analysis.' },
  'Market Analysis': { name: 'Market Analysis', icon: <BarChart3 className="h-5 w-5" />, description: 'Market research, industry analysis, and market trend identification.' },
  'Competitor Analysis': { name: 'Competitor Analysis', icon: <Target className="h-5 w-5" />, description: 'Competitive analysis, benchmarking, and competitive intelligence gathering.' },
  'Academic': { name: 'Academic', icon: <BookOpen className="h-5 w-5" />, description: 'Academic research, scholarly articles, and theoretical foundations.' },

  // Blog Subcategories
  'User Guide': { name: 'User Guide', icon: <BookOpen className="h-5 w-5" />, description: 'Step-by-step guides and tutorials for users and developers.' },
  'Notes': { name: 'Notes', icon: <PenTool className="h-5 w-5" />, description: 'Personal notes, quick thoughts, and informal documentation.' },
  'Ideas': { name: 'Ideas', icon: <Lightbulb className="h-5 w-5" />, description: 'Creative ideas, brainstorming, and conceptual thinking.' },
  'Journal': { name: 'Journal', icon: <Calendar className="h-5 w-5" />, description: 'Personal journal entries, reflections, and periodic updates.' },
  'Technical': { name: 'Technical', icon: <Code className="h-5 w-5" />, description: 'Technical deep-dives, code explanations, and engineering insights.' },
  'Learning': { name: 'Learning', icon: <BookOpen className="h-5 w-5" />, description: 'Learning experiences, educational content, and knowledge sharing.' },
  'API': { name: 'API', icon: <GitBranch className="h-5 w-5" />, description: 'API documentation, integration guides, and technical specifications.' },
  'Process': { name: 'Process', icon: <Settings className="h-5 w-5" />, description: 'Process documentation, workflows, and operational procedures.' },

  // Fallback
  'Other': { name: 'Other', icon: <BookOpen className="h-5 w-5" />, description: 'Miscellaneous content that doesn\'t fit into other categories.' }
}

export type CategoryKey = keyof typeof categoryInfo