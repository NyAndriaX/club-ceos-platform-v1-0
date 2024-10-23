import { Prisma, PrismaClient, Theme } from '@prisma/client';


const prisma: PrismaClient = new PrismaClient();

const handleCreate = async (data: Prisma.ThemeCreateInput): Promise<Theme | null> => {
  const theme = await prisma.theme.create({
    data
  })

  if (!theme) return null;

  return theme;
};

const handleGetAllThemes = async (): Promise<Theme[] | []> => {
  const themes = await prisma.theme.findMany();

  return themes ?? [];
};

export { handleCreate, handleGetAllThemes };
