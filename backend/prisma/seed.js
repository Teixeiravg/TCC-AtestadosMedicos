const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {

    console.log('Limpando banco de dados...');

    await prisma.auditLog.deleteMany();
    await prisma.consentAgreement.deleteMany();
    await prisma.medicalCertificate.deleteMany();
    await prisma.user.deleteMany();
    console.log('Semeando banco de dados...');

    // =========================
    // USERS
    // =========================
    const userPassword = await bcrypt.hash('123456', 10);
    const adminPassword = await bcrypt.hash('adm123', 10);

    const admin = await prisma.user.create({
        data: {
        name: 'Admin Test',
        email: 'admin@test.com',
        passwordHash: adminPassword,
        role: 'ADMIN',
        },
    });

    const joao = await prisma.user.create({
        data: {
        name: 'João Silva',
        email: 'joao@test.com',
        passwordHash: userPassword,
        role: 'EMPLOYEE',
        },
    });

    const maria = await prisma.user.create({
        data: {
        name: 'Maria Souza',
        email: 'maria@test.com',
        passwordHash: userPassword,
        role: 'EMPLOYEE',
        },
    });

    // =========================
    // CERTIFICATES
    // =========================

    const cert1 = await prisma.medicalCertificate.create({
        data: {
        startDate: new Date('2026-04-01'),
        endDate: new Date('2026-04-03'),
        status: 'PENDING',
        fileUrl: '/uploads/atestado-joao-1.pdf',
        crmNumber: 'CRM12345',
        userId: joao.id,
        },
    });

    const cert2 = await prisma.medicalCertificate.create({
        data: {
        startDate: new Date('2026-04-10'),
        endDate: new Date('2026-04-12'),
        status: 'APPROVED',
        fileUrl: '/uploads/atestado-joao-2.pdf',
        crmNumber: 'CRM54321',
        userId: joao.id,
        reviewedById: admin.id,
        },
    });

    const cert3 = await prisma.medicalCertificate.create({
        data: {
        startDate: new Date('2026-04-05'),
        endDate: new Date('2026-04-06'),
        status: 'REJECTED',
        fileUrl: '/uploads/atestado-maria-1.pdf',
        crmNumber: 'CRM99999',
        userId: maria.id,
        reviewedById: admin.id,
        },
    });

    // =========================
    // AUDIT LOGS
    // =========================

    await prisma.auditLog.create({
        data: {
        action: 'APPROVE_CERTIFICATE',
        previousState: 'PENDING',
        newState: 'APPROVED',
        adminNotes: 'Approved after review',
        ipAddress: '127.0.0.1',
        certificatedId: cert2.id,
        actorId: admin.id,
        },
    });

    await prisma.auditLog.create({
        data: {
        action: 'REJECT_CERTIFICATE',
        previousState: 'PENDING',
        newState: 'REJECTED',
        adminNotes: 'Invalid document',
        ipAddress: '127.0.0.1',
        certificatedId: cert3.id,
        actorId: admin.id,
        },
    });

    console.log('Seed finalizada');
    }

    main()
    .catch((e) => {
        console.error('Erro na seed:', e);
    })
    .finally(async () => {
        await prisma.$disconnect();
  });