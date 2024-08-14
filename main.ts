import { App, fuzzySearch, FuzzySuggestModal, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface PluginSettings {
	folder: string;
}

interface Search {
    openGlobalSearch(_: string): void;
    getGlobalSearchQuery(): string;
}

const DEFAULT_SETTINGS: PluginSettings = {
	folder: ''
}

class RibbonButtonPluginSettingTab extends PluginSettingTab {
	plugin: RibbonButtonPlugin;

	constructor(app: App, plugin: RibbonButtonPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Folder')
			.addText(text => text
				.setPlaceholder('My Folder')
				.setValue(this.plugin.settings.folder)
				.onChange(async (value) => {
					this.plugin.settings.folder = value;
					await this.plugin.saveSettings();
				}));
	}
}

export default class RibbonButtonPlugin extends Plugin {
	settings: PluginSettings;

	async onload() {
		await this.loadSettings();

		const ribbonIconEl = this.addRibbonIcon('banana', 'Mikala\'s Button', (evt: MouseEvent) => {
			this.app.vault.create(this.settings.folder + '/Untitled.md', '');
		});

		ribbonIconEl.addClass('my-plugin-ribbon-class');

		this.addSettingTab(new RibbonButtonPluginSettingTab(this.app, this));
}


	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}