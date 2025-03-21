import React, { useState, DragEvent } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Component {
  id: string;
  type: string;
  props: {
    className?: string;
    children?: string;
    placeholder?: string;
    type?: string;
    [key: string]: any;
  };
}

interface AppState {
  components: Component[];
}

const componentTypes = [
  { type: 'div', displayName: 'Container' },
  { type: 'h1', displayName: 'Heading 1' },
  { type: 'h2', displayName: 'Heading 2' },
  { type: 'p', displayName: 'Paragraph' },
  { type: 'button', displayName: 'Button' },
  { type: 'input', displayName: 'Input' },
  { type: 'img', displayName: 'Image' },
];

const AppBuilder: React.FC = () => {
  const [app, setApp] = useState<AppState>({
    components: [],
  });
  
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [appName, setAppName] = useState<string>('My App');
  const [history, setHistory] = useState<AppState[]>([{ components: [] }]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const addComponent = (type: string) => {
    const newComponent: Component = {
      id: `component-${Date.now()}`,
      type,
      props: {
        className: getDefaultClassForType(type),
        children: getDefaultTextForType(type),
      },
    };

    if (type === 'input') {
      newComponent.props.placeholder = 'Enter text...';
      newComponent.props.type = 'text';
    }

    if (type === 'img') {
      newComponent.props.src = 'https://via.placeholder.com/150';
      newComponent.props.alt = 'Image';
    }

    const updatedApp = {
      ...app,
      components: [...app.components, newComponent],
    };

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedApp);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    setApp(updatedApp);
    setSelectedComponentId(newComponent.id);
  };

  const selectComponent = (id: string) => {
    if (!previewMode) {
      setSelectedComponentId(id);
    }
  };

  const updateComponent = (id: string, props: { [key: string]: any }) => {
    const updatedComponents = app.components.map((component) => {
      if (component.id === id) {
        return {
          ...component,
          props: {
            ...component.props,
            ...props,
          },
        };
      }
      return component;
    });

    const updatedApp = {
      ...app,
      components: updatedComponents,
    };

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedApp);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    setApp(updatedApp);
  };

  const removeComponent = (id: string) => {
    const updatedComponents = app.components.filter((component) => component.id !== id);
    
    const updatedApp = {
      ...app,
      components: updatedComponents,
    };

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedApp);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    setApp(updatedApp);
    setSelectedComponentId(null);
  };

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
    if (!previewMode) {
      setSelectedComponentId(null);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setApp(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setApp(history[newIndex]);
    }
  };

  const exportApp = () => {
    const appData = JSON.stringify(app, null, 2);
    const blob = new Blob([appData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appName.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getDefaultClassForType = (type: string): string => {
    switch (type) {
      case 'div':
        return 'bg-secondary-light p-4 rounded-lg';
      case 'h1':
        return 'text-3xl font-bold mb-4';
      case 'h2':
        return 'text-2xl font-bold mb-3';
      case 'p':
        return 'text-base mb-2';
      case 'button':
        return 'bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded';
      case 'input':
        return 'bg-secondary-dark text-white border border-gray-700 rounded px-3 py-2 w-full';
      case 'img':
        return 'rounded-lg max-w-full';
      default:
        return '';
    }
  };

  const getDefaultTextForType = (type: string): string => {
    switch (type) {
      case 'h1':
        return 'Heading 1';
      case 'h2':
        return 'Heading 2';
      case 'p':
        return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor enim vitae ipsum vestibulum, vel pharetra nisi tristique.';
      case 'button':
        return 'Click Me';
      default:
        return '';
    }
  };

  const renderComponent = (component: Component) => {
    const { id, type, props } = component;
    const isSelected = selectedComponentId === id && !previewMode;

    const commonProps = {
      key: id,
      className: `${props.className || ''} ${isSelected ? 'ring-2 ring-primary ring-opacity-70' : ''}`,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        selectComponent(id);
      },
    };

    switch (type) {
      case 'div':
        return <div {...commonProps}>{props.children}</div>;
      case 'h1':
        return <h1 {...commonProps}>{props.children}</h1>;
      case 'h2':
        return <h2 {...commonProps}>{props.children}</h2>;
      case 'p':
        return <p {...commonProps}>{props.children}</p>;
      case 'button':
        return (
          <button {...commonProps} type="button" disabled={previewMode}>
            {props.children}
          </button>
        );
      case 'input':
        return (
          <input
            {...commonProps}
            type={props.type || 'text'}
            placeholder={props.placeholder || ''}
            disabled={previewMode}
          />
        );
      case 'img':
        return <img {...commonProps} src={props.src} alt={props.alt} />;
      default:
        return null;
    }
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, type: string) => {
    e.dataTransfer.setData('type', type);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    if (type) {
      addComponent(type);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">App Builder</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left sidebar - Component palette */}
        <div className="w-full lg:w-1/4">
          <div className="bg-secondary-light rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Components</h2>
            <div className="space-y-2">
              {componentTypes.map((component) => (
                <div
                  key={component.type}
                  className="bg-secondary p-2 rounded cursor-pointer hover:bg-gray-700 flex items-center"
                  draggable
                  onDragStart={(e) => handleDragStart(e, component.type)}
                  onClick={() => addComponent(component.type)}
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  <span>{component.displayName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="w-full lg:w-2/4">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="bg-secondary-dark text-white px-3 py-2 rounded border border-gray-700 w-48"
              placeholder="Enter app name"
              title="App Name"
            />
            <div className="space-x-2">
              <button
                className="bg-secondary-light hover:bg-secondary text-white px-3 py-1 rounded text-sm"
                onClick={handleUndo}
                disabled={historyIndex === 0}
              >
                Undo
              </button>
              <button
                className="bg-secondary-light hover:bg-secondary text-white px-3 py-1 rounded text-sm"
                onClick={handleRedo}
                disabled={historyIndex === history.length - 1}
              >
                Redo
              </button>
              <button
                className={`${
                  previewMode ? 'bg-primary' : 'bg-secondary-light'
                } hover:bg-primary-dark text-white px-3 py-1 rounded text-sm`}
                onClick={togglePreviewMode}
              >
                {previewMode ? 'Edit Mode' : 'Preview'}
              </button>
              <button
                className="bg-accent hover:bg-accent-dark text-black px-3 py-1 rounded text-sm"
                onClick={exportApp}
              >
                Export
              </button>
            </div>
          </div>
          <div
            className="bg-secondary min-h-[500px] rounded-lg shadow-lg p-4 overflow-auto"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {app.components.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p>Drag and drop components here</p>
                <p className="mt-2 text-sm">or select from the components panel</p>
              </div>
            ) : (
              app.components.map((component) => renderComponent(component))
            )}
          </div>
        </div>

        {/* Right sidebar - Properties */}
        <div className="w-full lg:w-1/4">
          <div className="bg-secondary-light rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Properties</h2>
            {selectedComponentId ? (
              <div>
                {app.components
                  .filter((c) => c.id === selectedComponentId)
                  .map((component) => (
                    <div key={component.id} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                        <div className="text-white bg-secondary py-2 px-3 rounded">
                          {component.type}
                        </div>
                      </div>

                      {component.props.children !== undefined && (
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Content</label>
                          <textarea
                            value={component.props.children}
                            onChange={(e) =>
                              updateComponent(component.id, { children: e.target.value })
                            }
                            className="w-full bg-secondary-dark text-white px-3 py-2 rounded border border-gray-700"
                            rows={3}
                            placeholder="Enter component content"
                            title="Component Content"
                          />
                        </div>
                      )}

                      {component.type === 'input' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Placeholder</label>
                          <input
                            type="text"
                            value={component.props.placeholder || ''}
                            onChange={(e) =>
                              updateComponent(component.id, { placeholder: e.target.value })
                            }
                            className="w-full bg-secondary-dark text-white px-3 py-2 rounded border border-gray-700"
                            placeholder="Enter placeholder text"
                            title="Input Placeholder"
                          />
                        </div>
                      )}

                      {component.type === 'img' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Image URL</label>
                            <input
                              type="text"
                              value={component.props.src || ''}
                              onChange={(e) =>
                                updateComponent(component.id, { src: e.target.value })
                              }
                              className="w-full bg-secondary-dark text-white px-3 py-2 rounded border border-gray-700"
                              placeholder="Enter image URL"
                              title="Image URL"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Alt Text</label>
                            <input
                              type="text"
                              value={component.props.alt || ''}
                              onChange={(e) =>
                                updateComponent(component.id, { alt: e.target.value })
                              }
                              className="w-full bg-secondary-dark text-white px-3 py-2 rounded border border-gray-700"
                              placeholder="Enter alt text"
                              title="Image Alt Text"
                            />
                          </div>
                        </>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">CSS Classes</label>
                        <input
                          type="text"
                          value={component.props.className || ''}
                          onChange={(e) =>
                            updateComponent(component.id, { className: e.target.value })
                          }
                          className="w-full bg-secondary-dark text-white px-3 py-2 rounded border border-gray-700"
                          placeholder="Enter CSS classes"
                          title="CSS Classes"
                        />
                      </div>

                      <button
                        className="w-full bg-red-700 hover:bg-red-800 text-white px-3 py-2 rounded mt-4 flex items-center justify-center"
                        onClick={() => removeComponent(component.id)}
                      >
                        <TrashIcon className="h-5 w-5 mr-1" />
                        Remove Component
                      </button>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                Select a component to edit its properties
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppBuilder; 