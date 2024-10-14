import { ThemeOutput, ThemeInput } from '@/typings/theme';
import * as themeRepository from '@/database/repository/theme.repository';

const handleCreate = async (data: ThemeInput): Promise<ThemeOutput | null> => {
  const theme = await themeRepository.save(data);

  if (!theme) return null;

  return theme;
};

const handleGetAllThemes = async (): Promise<ThemeOutput[] | []> => {
  const themes = await themeRepository.findMany();

  return themes ?? [];
};

export { handleCreate, handleGetAllThemes };
