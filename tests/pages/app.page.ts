import { Page, Locator } from '@playwright/test';

export class AppPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(): Promise<void> {
    await this.page.goto('#/');
    await this.waitForPageLoad();
  }

  async navigateToOptions(): Promise<void> {
    await this.page.goto('#/options');
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForSelector('app-root', { timeout: 10000 });
  }

  async clickDisplayTab(): Promise<void> {
    const displayTab = this.page.getByRole('tab', { name: 'Display' });
    await displayTab.waitFor({ state: 'visible', timeout: 5000 });
    await displayTab.click();
  }

  async expandThemePanel(): Promise<void> {
    const themePanel = this.page.locator('mat-expansion-panel-header').filter({ hasText: 'Theme' });
    await themePanel.waitFor({ state: 'visible', timeout: 5000 });
    const isExpanded = await themePanel.getAttribute('aria-expanded');
    if (isExpanded !== 'true') {
      await themePanel.click();
      await this.page.waitForTimeout(300);
    }
  }

  getThemeToggle(): Locator {
    return this.page.locator('button[name="isLightTheme"]');
  }

  getThemeToggleParent(): Locator {
    return this.page.locator('mat-slide-toggle').filter({ has: this.page.locator('button[name="isLightTheme"]') });
  }

  async isLightThemeEnabled(): Promise<boolean> {
    const bodyClasses = await this.page.locator('body').getAttribute('class');
    return bodyClasses?.includes('light-theme') ?? false;
  }

  async isThemeToggleChecked(): Promise<boolean> {
    const toggle = this.getThemeToggleParent();
    await toggle.waitFor({ state: 'visible', timeout: 5000 });
    const classes = await toggle.getAttribute('class');
    return classes?.includes('mat-mdc-slide-toggle-checked') ?? false;
  }

  async toggleLightTheme(): Promise<void> {
    const toggle = this.getThemeToggle();
    await toggle.waitFor({ state: 'visible', timeout: 5000 });
    await toggle.click();
  }

  async saveDisplaySettings(): Promise<void> {
    const saveButton = this.page.locator('settings-display form button[type="submit"]');
    await saveButton.waitFor({ state: 'visible', timeout: 5000 });
    await saveButton.click();
    await this.page.waitForTimeout(1000);
  }

  async clearLocalStorage(): Promise<void> {
    await this.page.evaluate(() => window.localStorage.clear());
  }

  async refreshPage(): Promise<void> {
    await this.page.reload();
    await this.waitForPageLoad();
  }
}
