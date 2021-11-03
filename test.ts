// let arr = {};

// class Factory {
//   constructor(id: string) {
//     this.addItems(id);
//   }

//   addItems(id: string) {
//     if (!arr[id]) {
//       console.log("found");
//       arr[id] = [];
//       const items = ["a", "b", "c", "d", "e", "f"];
//       for (let i = 0; i < 5; i++) {
//         var item = items[Math.floor(Math.random() * items.length)];
//         arr[id].push(item);
//       }
//     }
//   }
//   getItems(id: string) {
//     return arr[id];
//   }

//   addMoreItems(id: string) {
//     if (arr[id]) {
//       for (let i = 0; i < 5; i++) {
//         arr[id].push("a");
//       }
//     }
//   }
// }

// class Consumer extends Factory {
//   poolId: any;
//   constructor(id: string) {
//     super(id);
//     this.poolId = id;
//   }

//   init() {
//     return this.getItems(this.poolId);
//   }

//   add() {
//     this.addMoreItems(this.poolId);
//   }
// }

// const p1 = new Consumer("1");
// const p2 = new Consumer("1");

// const p3 = new Consumer("2");
// const p4 = new Consumer("2");

// console.log(p1.init());
// console.log(p2.init());
// console.log(p3.init());
// console.log(p4.init());

// console.log("-------------------");
// p1.add();

// console.log(p1.init());
// console.log(p2.init());
// console.log(p3.init());
// console.log(p4.init());
