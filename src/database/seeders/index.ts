import { PrismaClient } from "@prisma/client";
import { createPlans } from "./plan";
import { createUsers } from "./user";

const prismaClient = new PrismaClient();

const main = async () => {

  console.log('=> Total seed duration');

  /* ------------------------------------------------------------*/
  const users = await createUsers({
    prismaClient
  });

  console.timeEnd('User seed duration')

  /* ------------------------------------------------------------*/


  /* ------------------------------------------------------------*/

  const plans = await createPlans();

  console.timeEnd('Plan seed duration');

  /* ------------------------------------------------------------*/

  console.log('=> Total seed duration');
}

main()
  .catch(error => {
    console.log(error)
  })
  .finally(async () => {
    await prismaClient.$disconnect()
  })