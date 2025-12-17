import { test, expect } from '@playwright/test';
import { AppPage } from './pages/app.page';

test.describe('Theme Switching', () => {
  let appPage: AppPage;

  test.beforeEach(async ({ page }) => {
    appPage = new AppPage(page);
    await appPage.navigateTo();
    await appPage.clearLocalStorage();
  });

  test.describe('Dark to Light Theme', () => {
    test('should persist light theme after page reload', async ({ page }) => {
      await appPage.navigateToOptions();
      await appPage.clickDisplayTab();
      await page.waitForTimeout(500);
      await appPage.expandThemePanel();

      const initialThemeState = await appPage.isLightThemeEnabled();
      expect(initialThemeState).toBe(false);

      await appPage.toggleLightTheme();
      await page.waitForTimeout(300);

      await appPage.saveDisplaySettings();

      const themeAfterSave = await appPage.isLightThemeEnabled();
      expect(themeAfterSave).toBe(true);

      await appPage.refreshPage();

      await appPage.navigateToOptions();
      await appPage.clickDisplayTab();
      await page.waitForTimeout(500);
      await appPage.expandThemePanel();

      const themeAfterReload = await appPage.isLightThemeEnabled();
      expect(themeAfterReload).toBe(true);

      const toggleStateAfterReload = await appPage.isThemeToggleChecked();
      expect(toggleStateAfterReload).toBe(true);
    });
  });

  test.describe('Light to Dark Theme', () => {
    test('should persist dark theme after page reload', async ({ page }) => {
      await appPage.navigateToOptions();
      await appPage.clickDisplayTab();
      await page.waitForTimeout(500);
      await appPage.expandThemePanel();

      await appPage.toggleLightTheme();
      await page.waitForTimeout(300);
      await appPage.saveDisplaySettings();

      const currentTheme = await appPage.isLightThemeEnabled();
      expect(currentTheme).toBe(true);

      await appPage.expandThemePanel();
      await appPage.toggleLightTheme();
      await page.waitForTimeout(300);

      await appPage.saveDisplaySettings();

      const themeAfterSave = await appPage.isLightThemeEnabled();
      expect(themeAfterSave).toBe(false);

      await appPage.refreshPage();

      await appPage.navigateToOptions();
      await appPage.clickDisplayTab();
      await page.waitForTimeout(500);
      await appPage.expandThemePanel();

      const themeAfterReload = await appPage.isLightThemeEnabled();
      expect(themeAfterReload).toBe(false);

      const toggleStateAfterReload = await appPage.isThemeToggleChecked();
      expect(toggleStateAfterReload).toBe(false);
    });
  });
});
