const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    console.log('เริ่มเพิ่มข้อมูล...')

    // ลบข้อมูลเก่าทั้งหมด
    console.log('ลบข้อมูลเก่า...')
    await prisma.usageHistory.deleteMany()
    await prisma.machines.deleteMany()

    // เพิ่มข้อมูลใหม่
    console.log('เพิ่มข้อมูลใหม่...')
    const machines = await prisma.machines.createMany({
      data: [
        { 
          name: 'เครื่องซักผ้า 1',
          status: false,
          time: 10
        },
        { 
          name: 'เครื่องซักผ้า 2',
          status: false,
          time: 10
        },
        { 
          name: 'เครื่องซักผ้า 3',
          status: false,
          time: 10
        },
        { 
          name: 'เครื่องซักผ้า 4',
          status: false,
          time: 10
        }
      ]
    })

    console.log('เพิ่มข้อมูลสำเร็จ:', machines)

  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  }) 