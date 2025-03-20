class LayersManager {
    constructor(map) {
        this.map = map;
        this.layerGroups = new Map();
        this.initializeLayerGroups();
    }

    initializeLayerGroups() {
        // Get all layers from the current style
        const style = this.map.getStyle();
        if (!style || !style.layers) return;

        // Group layers by their metadata.group
        style.layers.forEach(layer => {
            if (layer.metadata && layer.metadata.group) {
                const groupName = layer.metadata.group;
                if (!this.layerGroups.has(groupName)) {
                    this.layerGroups.set(groupName, {
                        name: groupName,
                        layers: [],
                        visible: true
                    });
                }
                this.layerGroups.get(groupName).layers.push(layer.id);
            }
        });
    }

    createLayerControls(container) {
        this.layerGroups.forEach((group, groupName) => {
            const groupContainer = document.createElement('div');
            groupContainer.className = 'layer-group';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `layer-group-${groupName}`;
            checkbox.checked = group.visible;
            checkbox.addEventListener('change', (e) => {
                this.toggleLayerGroup(groupName, e.target.checked);
            });

            const label = document.createElement('label');
            label.htmlFor = `layer-group-${groupName}`;
            label.textContent = this.formatGroupName(groupName);

            groupContainer.appendChild(checkbox);
            groupContainer.appendChild(label);
            container.appendChild(groupContainer);
        });
    }

    toggleLayerGroup(groupName, visible) {
        const group = this.layerGroups.get(groupName);
        if (!group) return;

        group.visible = visible;
        group.layers.forEach(layerId => {
            this.map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
        });
    }

    formatGroupName(groupName) {
        // Convert snake_case or kebab-case to Title Case
        return groupName
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    // Method to get the current state of layer groups
    getLayerGroupsState() {
        const state = {};
        this.layerGroups.forEach((group, name) => {
            state[name] = group.visible;
        });
        return state;
    }

    // Method to set the state of layer groups
    setLayerGroupsState(state) {
        Object.entries(state).forEach(([groupName, visible]) => {
            if (this.layerGroups.has(groupName)) {
                this.toggleLayerGroup(groupName, visible);
            }
        });
    }
}

// Export for use in other files
window.LayersManager = LayersManager; 