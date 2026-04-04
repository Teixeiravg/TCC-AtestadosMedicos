const atestados = [{
    id: "uuid-1",
    startDate: "2026-06-01",
    endDate: "2026-06-05",
    status: "PENDING",
    fileUrl: "/uploads/atestado1.pdf",
    crmNumber: "123456",
    userId: "uuid-user-1",
    reviewedById: null
}, {
    id: "uuid-2",
    startDate: "2026-06-10",
    endDate: "2026-06-12",
    status: "APPROVED",
    fileUrl: "/uploads/atestado2.pdf",
    crmNumber: "654321",
    userId: "uuid-user-2",
    reviewedById: "uuid-admin-1"
}, {
    id: "uuid-3",
    startDate: "2026-06-15",
    endDate: "2026-06-22",
    status: "REJECTED",
    fileUrl: "/uploads/atestado3.pdf",
    crmNumber: "789012",
    userId: "uuid-user-1",
    reviewedById: "uuid-admin-2"
}

];

export default atestados;
