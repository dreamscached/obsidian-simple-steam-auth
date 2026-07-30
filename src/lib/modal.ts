/*
 * Simple Steam Auth - Generate Steam Guard codes right in your vault.
 * Copyright (C) 2026 dreamscached <dreamscache.d@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { App, Modal, Setting } from "obsidian";

/** Texts shown by {@link ConfirmModal}. */
export interface ConfirmModalOptions {
	/** Modal title. */
	title: string;
	/** Message explaining what is being confirmed. */
	message: string;
	/** Label of the confirming button. */
	confirmText: string;
	/** Label of the dismissing button. */
	cancelText: string;
}

/**
 * Modal asking the user to confirm an action before it is carried out.
 */
export class ConfirmModal extends Modal {
	private readonly options: ConfirmModalOptions;
	private confirmed = false;
	private resolve?: (confirmed: boolean) => void;

	/**
	 * Create a new instance of {@link ConfirmModal}.
	 * @param app Obsidian app
	 * @param options texts to show in the modal
	 */
	constructor(app: App, options: ConfirmModalOptions) {
		super(app);
		this.options = options;
	}

	/**
	 * Opens the modal and waits for the user to answer it.
	 * @returns whether the user confirmed the action
	 */
	confirm(): Promise<boolean> {
		return new Promise((resolve) => {
			this.resolve = resolve;
			this.open();
		});
	}

	override onOpen(): void {
		this.setTitle(this.options.title);
		this.setContent(this.options.message);

		new Setting(this.contentEl)
			.addButton((it) =>
				it.setButtonText(this.options.cancelText).onClick(() => this.close())
			)
			.addButton((it) =>
				// setDestructive() is only available since Obsidian 1.13.0
				it
					.setButtonText(this.options.confirmText)
					.setWarning()
					.onClick(() => {
						this.confirmed = true;
						this.close();
					})
			);
	}

	// Dismissing the modal (Escape, clicking outside) counts as not confirming.
	override onClose(): void {
		this.contentEl.empty();
		this.resolve?.(this.confirmed);
	}
}
