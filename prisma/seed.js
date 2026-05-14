import prisma from "../src/lib/prisma.js";

async function main() {
  await prisma.product.deleteMany();
  console.log("기존 데이터 삭제 완료");

  await prisma.product.create({
    data: {
      name: "중고 맥북 에어 M1",
      price: 780000,
      description: "생활기스 조금 있지만 상태 좋습니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "로지텍 무선 마우스",
      price: 25000,
      description: "거의 새상품이고 배터리 포함입니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "게이밍 키보드",
      price: 45000,
      description: "청축이며 LED 정상 작동합니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "아이패드 프로 11",
      price: 920000,
      description: "펜슬 포함 판매합니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "에어팟 프로 2세대",
      price: 180000,
      description: "케이스 사용해서 상태 깨끗합니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "컴퓨터 책상",
      price: 30000,
      description: "직접 가져가셔야 합니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "LG 27인치 모니터",
      price: 120000,
      description: "FHD 144hz 지원합니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "닌텐도 스위치",
      price: 240000,
      description: "동물의 숲 칩 포함입니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "플레이스테이션5",
      price: 550000,
      description: "디스크 버전이며 박스 있습니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "헬스 덤벨 세트",
      price: 70000,
      description: "5kg~20kg 조절 가능합니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "아이폰 14",
      price: 650000,
      description: "배터리 효율 91%입니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "갤럭시 탭 S8",
      price: 430000,
      description: "필름 붙여서 사용했습니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "캠핑 의자",
      price: 15000,
      description: "접이식이고 사용감 적습니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "브리츠 스피커",
      price: 20000,
      description: "음질 좋고 정상 작동합니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "전자레인지",
      price: 35000,
      description: "자취방 정리로 판매합니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "RTX 3070 그래픽카드",
      price: 320000,
      description: "채굴 이력 없습니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "삼성 노트북",
      price: 410000,
      description: "대학생 과제용으로 사용했습니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "자전거",
      price: 95000,
      description: "브레이크 점검 완료했습니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "독서용 스탠드",
      price: 10000,
      description: "밝기 조절 가능합니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "커피 머신",
      price: 50000,
      description: "캡슐 포함해서 드립니다.",
    },
  });
  console.log("아무개 생성");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("DB 연결 종료");
  });
