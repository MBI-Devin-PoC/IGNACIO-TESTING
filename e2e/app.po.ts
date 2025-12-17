import { browser, by, element, ExpectedConditions as EC, ElementFinder } from 'protractor';

export class SailmonitorPage {
  navigateTo() {
    return browser.get('#/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }

  /**
   * Navigate to the options page (uses hash routing)
   */
  navigateToOptions() {
    return browser.get('#/options');
  }

  /**
   * Click on the Display tab in the options page
   */
  async clickDisplayTab(): Promise<void> {
    const displayTab = element(by.cssContainingText('.mat-mdc-tab', 'Display'));
    await browser.wait(EC.elementToBeClickable(displayTab), 5000, 'Display tab not clickable');
    await displayTab.click();
  }

  /**
   * Get the light theme toggle element
   */
  getThemeToggle(): ElementFinder {
    return element(by.css('mat-slide-toggle[name="isLightTheme"]'));
  }

  /**
   * Check if the light theme is currently enabled by checking the body class
   */
  async isLightThemeEnabled(): Promise<boolean> {
    const bodyElement = element(by.css('body'));
    const classes = await bodyElement.getAttribute('class');
    return classes.includes('light-theme');
  }

  /**
   * Check if the theme toggle is checked (light theme enabled in settings)
   */
  async isThemeToggleChecked(): Promise<boolean> {
    const toggle = this.getThemeToggle();
    await browser.wait(EC.presenceOf(toggle), 5000, 'Theme toggle not present');
    const checkedAttr = await toggle.getAttribute('class');
    return checkedAttr.includes('mat-mdc-slide-toggle-checked');
  }

  /**
   * Toggle the light theme switch
   */
  async toggleLightTheme(): Promise<void> {
    const toggle = this.getThemeToggle();
    await browser.wait(EC.elementToBeClickable(toggle), 5000, 'Theme toggle not clickable');
    await toggle.click();
  }

  /**
   * Click the save button to save display settings
   */
  async saveDisplaySettings(): Promise<void> {
    const saveButton = element(by.css('form#displaySetting button[type="submit"]'));
    await browser.wait(EC.elementToBeClickable(saveButton), 5000, 'Save button not clickable');
    await saveButton.click();
    // Wait for the snackbar notification to appear and disappear
    await browser.sleep(1000);
  }

  /**
   * Clear localStorage to reset theme settings
   */
  async clearLocalStorage(): Promise<void> {
    await browser.executeScript('window.localStorage.clear();');
  }

  /**
   * Wait for the page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await browser.wait(EC.presenceOf(element(by.css('app-root'))), 10000, 'App root not present');
  }

  /**
   * Refresh the page
   */
  async refreshPage(): Promise<void> {
    await browser.refresh();
    await this.waitForPageLoad();
  }
}
