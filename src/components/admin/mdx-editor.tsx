'use client';

import { forwardRef, useEffect, useState } from 'react';
import {
  MDXEditor as BaseMDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  toolbarPlugin,
  frontmatterPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  StrikeThroughSupSubToggles,
  ListsToggle,
  BlockTypeSelect,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  CodeToggle,
  DiffSourceToggleWrapper,
  Separator,
  type MDXEditorMethods,
} from '@mdxeditor/editor';
import { EditorView } from '@codemirror/view';
import '@mdxeditor/editor/style.css';

// Light theme for CodeMirror (source/diff mode)
const lightTheme = EditorView.theme({
  '&': {
    backgroundColor: '#ffffff',
    color: '#1f2937',
  },
  '.cm-content': {
    caretColor: '#1f2937',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: '#1f2937',
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: '#d1d5db',
  },
  '.cm-gutters': {
    backgroundColor: '#f9fafb',
    color: '#6b7280',
    border: 'none',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#f3f4f6',
  },
  '.cm-activeLine': {
    backgroundColor: '#f9fafb',
  },
});

interface MDXEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

/**
 * MDXEditor wrapper component with WYSIWYG editing capabilities.
 * Includes toolbar, code block support, and diff view.
 */
export const MDXEditor = forwardRef<MDXEditorMethods, MDXEditorProps>(
  ({ value, onChange, placeholder = 'Start writing...', readOnly = false, className = '' }, ref) => {
    // Use mounted state to avoid SSR issues
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      // Show a loading placeholder during SSR
      return (
        <div className={`min-h-[500px] border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center ${className}`}>
          <div className="text-gray-400">Loading editor...</div>
        </div>
      );
    }

    return (
      <div className={`mdx-editor-wrapper ${className}`}>
        <BaseMDXEditor
          ref={ref}
          markdown={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          contentEditableClassName="mdx-editor-content prose max-w-none min-h-[400px] p-4 focus:outline-none"
          plugins={[
            // Core plugins
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            markdownShortcutPlugin(),

            // Link and image support
            linkPlugin(),
            linkDialogPlugin(),
            imagePlugin({
              imageUploadHandler: async () => {
                // For now, return a placeholder. Image upload can be implemented later.
                return Promise.resolve('https://via.placeholder.com/400x300');
              },
            }),

            // Table support
            tablePlugin(),

            // Code block support with syntax highlighting
            codeBlockPlugin({ defaultCodeBlockLanguage: 'typescript' }),
            codeMirrorPlugin({
              codeBlockLanguages: {
                typescript: 'TypeScript',
                javascript: 'JavaScript',
                tsx: 'TSX',
                jsx: 'JSX',
                css: 'CSS',
                html: 'HTML',
                json: 'JSON',
                markdown: 'Markdown',
                python: 'Python',
                bash: 'Bash',
                shell: 'Shell',
                yaml: 'YAML',
                sql: 'SQL',
                graphql: 'GraphQL',
                go: 'Go',
                rust: 'Rust',
                java: 'Java',
                cpp: 'C++',
                c: 'C',
                php: 'PHP',
                ruby: 'Ruby',
                swift: 'Swift',
                kotlin: 'Kotlin',
              },
              codeMirrorExtensions: [lightTheme],
            }),

            // Frontmatter support (for MDX files)
            frontmatterPlugin(),

            // Diff source view (toggle between rich text and markdown source)
            diffSourcePlugin({
              viewMode: 'rich-text',
              diffMarkdown: value,
            }),

            // Toolbar
            toolbarPlugin({
              toolbarContents: () => (
                <DiffSourceToggleWrapper>
                  <div className="flex flex-wrap items-center gap-1">
                    <UndoRedo />
                    <Separator />
                    <BoldItalicUnderlineToggles />
                    <StrikeThroughSupSubToggles />
                    <CodeToggle />
                    <Separator />
                    <BlockTypeSelect />
                    <Separator />
                    <ListsToggle />
                    <Separator />
                    <CreateLink />
                    <InsertImage />
                    <InsertTable />
                    <InsertThematicBreak />
                    <Separator />
                    <InsertCodeBlock />
                  </div>
                </DiffSourceToggleWrapper>
              ),
            }),
          ]}
        />
      </div>
    );
  }
);

MDXEditor.displayName = 'MDXEditor';
