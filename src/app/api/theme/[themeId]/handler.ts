import { Theme, PrismaClient } from '@prisma/client';

const prisma: PrismaClient = new PrismaClient();

const handleGetTheme = async (themeId: number): Promise<Theme | null> => {
  const theme = await prisma.theme.findUnique({ where: { id: themeId } })

  if (!theme) return null;

  return theme;
};

export { handleGetTheme };
