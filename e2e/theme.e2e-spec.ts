import { browser } from 'protractor';
import { SailmonitorPage } from './app.po';

describe('Theme Switching', () => {
  let page: SailmonitorPage;

  beforeEach(async () => {
    page = new SailmonitorPage();
    // Navigate to the app first to be able to clear localStorage
    await page.navigateTo();
    await page.waitForPageLoad();
    // Clear localStorage to ensure clean state
    await page.clearLocalStorage();
  });

  describe('Dark to Light Theme', () => {
    it('should persist light theme after page reload', async () => {
      // Step 1: Navigate to options page
      await page.navigateToOptions();
      await page.waitForPageLoad();

      // Step 2: Click on Display tab
      await page.clickDisplayTab();
      await browser.sleep(500); // Wait for tab content to load

      // Step 3: Verify initial state - light theme should be disabled (dark theme is default)
      const initialThemeState = await page.isLightThemeEnabled();
      expect(initialThemeState).toBe(false, 'Initial theme should be dark (light-theme class should not be present)');

      // Step 4: Toggle to enable light theme
      await page.toggleLightTheme();
      await browser.sleep(300); // Wait for toggle animation

      // Step 5: Save the settings
      await page.saveDisplaySettings();

      // Step 6: Verify theme is applied
      const themeAfterSave = await page.isLightThemeEnabled();
      expect(themeAfterSave).toBe(true, 'Light theme should be applied after saving');

      // Step 7: Refresh the page
      await page.refreshPage();

      // Step 8: Navigate back to options to verify persistence
      await page.navigateToOptions();
      await page.waitForPageLoad();

      // Step 9: Verify light theme persists after reload
      const themeAfterReload = await page.isLightThemeEnabled();
      expect(themeAfterReload).toBe(true, 'Light theme should persist after page reload');

      // Step 10: Verify toggle state is also persisted
      await page.clickDisplayTab();
      await browser.sleep(500);
      const toggleStateAfterReload = await page.isThemeToggleChecked();
      expect(toggleStateAfterReload).toBe(true, 'Theme toggle should remain checked after reload');
    });
  });

  describe('Light to Dark Theme', () => {
    it('should persist dark theme after page reload', async () => {
      // Step 1: First enable light theme
      await page.navigateToOptions();
      await page.waitForPageLoad();
      await page.clickDisplayTab();
      await browser.sleep(500);

      // Enable light theme first
      await page.toggleLightTheme();
      await browser.sleep(300);
      await page.saveDisplaySettings();

      // Verify light theme is enabled
      const currentTheme = await page.isLightThemeEnabled();
      expect(currentTheme).toBe(true, 'Light theme should be enabled initially');

      // Step 2: Now toggle back to dark theme
      await page.clickDisplayTab();
      await browser.sleep(500);
      await page.toggleLightTheme(); // Toggle OFF to disable light theme
      await browser.sleep(300);

      // Step 3: Save the settings
      await page.saveDisplaySettings();

      // Step 4: Verify dark theme is applied (light-theme class removed)
      const themeAfterSave = await page.isLightThemeEnabled();
      expect(themeAfterSave).toBe(false, 'Dark theme should be applied after saving (light-theme class removed)');

      // Step 5: Refresh the page
      await page.refreshPage();

      // Step 6: Navigate back to options to verify persistence
      await page.navigateToOptions();
      await page.waitForPageLoad();

      // Step 7: Verify dark theme persists after reload
      const themeAfterReload = await page.isLightThemeEnabled();
      expect(themeAfterReload).toBe(false, 'Dark theme should persist after page reload');

      // Step 8: Verify toggle state is also persisted
      await page.clickDisplayTab();
      await browser.sleep(500);
      const toggleStateAfterReload = await page.isThemeToggleChecked();
      expect(toggleStateAfterReload).toBe(false, 'Theme toggle should remain unchecked after reload');
    });
  });
});
