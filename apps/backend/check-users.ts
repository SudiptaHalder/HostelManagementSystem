import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany();
    console.log('Total users:', users.length);
    console.log('Users:', JSON.stringify(users, null, 2));
    
    const hostels = await prisma.hostel.findMany({
      include: { users: true }
    });
    console.log('\nHostels with users:');
    hostels.forEach(h => {
      console.log(`- ${h.name} (${h.slug}): ${h.users.length} users`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
