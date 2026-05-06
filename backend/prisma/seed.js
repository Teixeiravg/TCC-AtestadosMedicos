const { PrismaClient } = require('@prisma/client');
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

    const cert4 = await prisma.medicalCertificate.create({
        data: {
        startDate: new Date('2026-02-03'),
        endDate: new Date('2026-02-05'),
        status: 'PENDING',
        fileUrl: '/uploads/atestado-joao-4.pdf',
        crmNumber: 'CRM20003',
        userId: joao.id,
        },
    });

    const cert5 = await prisma.medicalCertificate.create({
    data: {
        startDate: new Date('2026-02-18'),
        endDate: new Date('2026-02-19'),
        status: 'APPROVED',
        fileUrl: '/uploads/atestado-joao-5.pdf',
        crmNumber: 'CRM20004',
        userId: joao.id,
    },
    });

    const cert6 = await prisma.medicalCertificate.create({
    data: {
        startDate: new Date('2026-03-07'),
        endDate: new Date('2026-03-08'),
        status: 'REJECTED',
        fileUrl: '/uploads/atestado-joao-6.pdf',
        crmNumber: 'CRM20005',
        userId: joao.id,
    },
    });

    const cert7 = await prisma.medicalCertificate.create({
    data: {
        startDate: new Date('2026-03-22'),
        endDate: new Date('2026-03-23'),
        status: 'APPROVED',
        fileUrl: '/uploads/atestado-joao-7.pdf',
        crmNumber: 'CRM20006',
        userId: joao.id,
    },
    });

    const cert8 = await prisma.medicalCertificate.create({
    data: {
        startDate: new Date('2026-04-10'),
        endDate: new Date('2026-04-11'),
        status: 'PENDING',
        fileUrl: '/uploads/atestado-joao-8.pdf',
        crmNumber: 'CRM20007',
        userId: joao.id,
    },
    });

    const cert9 = await prisma.medicalCertificate.create({
    data: {
        startDate: new Date('2026-04-25'),
        endDate: new Date('2026-04-26'),
        status: 'APPROVED',
        fileUrl: '/uploads/atestado-joao-9.pdf',
        crmNumber: 'CRM20008',
        userId: joao.id,
    },
    });

    const cert10 = await prisma.medicalCertificate.create({
    data: {
        startDate: new Date('2026-05-04'),
        endDate: new Date('2026-05-06'),
        status: 'REJECTED',
        fileUrl: '/uploads/atestado-joao-10.pdf',
        crmNumber: 'CRM20009',
        userId: joao.id,
    },
    });

    const cert11 = await prisma.medicalCertificate.create({
    data: {
        startDate: new Date('2026-05-19'),
        endDate: new Date('2026-05-20'),
        status: 'APPROVED',
        fileUrl: '/uploads/atestado-joao-11.pdf',
        crmNumber: 'CRM20010',
        userId: joao.id,
    },
    });

    const cert12 = await prisma.medicalCertificate.create({
    data: {
        startDate: new Date('2026-06-08'),
        endDate: new Date('2026-06-09'),
        status: 'PENDING',
        fileUrl: '/uploads/atestado-joao-12.pdf',
        crmNumber: 'CRM20011',
        userId: joao.id,
    },
    });

    const cert13 = await prisma.medicalCertificate.create({
    data: {
        startDate: new Date('2026-06-23'),
        endDate: new Date('2026-06-24'),
        status: 'APPROVED',
        fileUrl: '/uploads/atestado-joao-13.pdf',
        crmNumber: 'CRM20012',
        userId: joao.id,
    },
    });

    const cert14 = await prisma.medicalCertificate.create({
    data: {
        startDate: new Date('2026-07-02'),
        endDate: new Date('2026-07-04'),
        status: 'REJECTED',
        fileUrl: '/uploads/atestado-joao-14.pdf',
        crmNumber: 'CRM20013',
        userId: joao.id,
    },
    });

    const cert15 = await prisma.medicalCertificate.create({
    data: {
        startDate: new Date('2026-07-18'),
        endDate: new Date('2026-07-19'),
        status: 'APPROVED',
        fileUrl: '/uploads/atestado-joao-15.pdf',
        crmNumber: 'CRM20014',
        userId: joao.id,
    },
    });

    const cert16 = await prisma.medicalCertificate.create({
    data: {
        startDate: new Date('2026-08-06'),
        endDate: new Date('2026-08-07'),
        status: 'PENDING',
        fileUrl: '/uploads/atestado-joao-16.pdf',
        crmNumber: 'CRM20015',
        userId: joao.id,
    },
    });

    const cert17 = await prisma.medicalCertificate.create({
    data: {
        startDate: new Date('2026-08-21'),
        endDate: new Date('2026-08-22'),
        status: 'APPROVED',
        fileUrl: '/uploads/atestado-joao-17.pdf',
        crmNumber: 'CRM20016',
        userId: joao.id,
    },
    });

    const cert18 = await prisma.medicalCertificate.create({
    data: {
        startDate: new Date('2026-09-09'),
        endDate: new Date('2026-09-10'),
        status: 'REJECTED',
        fileUrl: '/uploads/atestado-joao-18.pdf',
        crmNumber: 'CRM20017',
        userId: joao.id,
    },
    });

    const cert19 = await prisma.medicalCertificate.create({
    data: {
        startDate: new Date('2026-09-24'),
        endDate: new Date('2026-09-25'),
        status: 'APPROVED',
        fileUrl: '/uploads/atestado-joao-19.pdf',
        crmNumber: 'CRM20018',
        userId: joao.id,
    },
    });

    const cert20 = await prisma.medicalCertificate.create({
    data: {
        startDate: new Date('2026-10-03'),
        endDate: new Date('2026-10-05'),
        status: 'PENDING',
        fileUrl: '/uploads/atestado-joao-20.pdf',
        crmNumber: 'CRM20019',
        userId: joao.id,
    },
    });

    const cert21 = await prisma.medicalCertificate.create({
    data: {
        startDate: new Date('2026-10-27'),
        endDate: new Date('2026-10-28'),
        status: 'APPROVED',
        fileUrl: '/uploads/atestado-joao-21.pdf',
        crmNumber: 'CRM20020',
        userId: joao.id,
    },
    });

    const cert22 = await prisma.medicalCertificate.create({
    data: {
        startDate: new Date('2026-11-11'),
        endDate: new Date('2026-11-12'),
        status: 'REJECTED',
        fileUrl: '/uploads/atestado-joao-22.pdf',
        crmNumber: 'CRM20021',
        userId: joao.id,
    },
    });

    const cert23 = await prisma.medicalCertificate.create({
    data: {
        startDate: new Date('2026-12-04'),
        endDate: new Date('2026-12-05'),
        status: 'APPROVED',
        fileUrl: '/uploads/atestado-joao-23.pdf',
        crmNumber: 'CRM20022',
        userId: joao.id,
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