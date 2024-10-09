import { ThemeOutput } from "@/typings/theme"
import * as themeRepository from "@/database/repository/theme.repository"

const handleGetTheme = async (themeId: number): Promise<ThemeOutput | null> => {
  const theme = await themeRepository.findThemeById(themeId);

  if (!theme) return null;

  return theme
}

export { handleGetTheme }