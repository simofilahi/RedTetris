import { userData } from "../../server/src/socket/interfaces";
const connect = require("../../server/src/config/connection");
const socketListener = require("../../server/src/socket");
const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");

jest.setTimeout(5000);

async function getSocketData(io) {
  const sockets = await io.fetchSockets();

  console.log({ socket: sockets });
  return { player_one: sockets[0], player_two: sockets[1] };
}

describe("my awesome project", () => {
  let io: any,
    serverSocket_player_one: any,
    serverSocket_player_two: any,
    clientSocket_player_one: any,
    clientSocket_player_two: any;

  beforeAll((done) => {
    connect();
    const httpServer = createServer();
    io = new Server(httpServer);
    socketListener(io);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket_player_one = new Client(`http://localhost:${port}`);
      clientSocket_player_two = new Client(`http://localhost:${port}`);
      setTimeout(async () => {
        const data = await getSocketData(io);
        serverSocket_player_one = data.player_one;
        serverSocket_player_two = data.player_two;
      }, 1000);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket_player_one.close();
    clientSocket_player_two.close();
  });

  test("should join the game in solo mode", (done) => {
    clientSocket_player_one.emit(
      "join",
      {
        multiplayer: false,
        gravityInterval: 800,
      },
      (
        error: boolean,
        {
          playerName,
          roomId,
          roomTitle,
          multiplayer,
          gravityInterval,
          playerRole,
        }: userData
      ) => {
        expect(error).toBe(false);
        expect(playerName).toEqual("anonymous");
        expect(typeof roomId === "string");
        expect(typeof roomTitle === "string");
        expect(multiplayer).toEqual(false);
        expect(gravityInterval).toEqual(800 || 500 || 100);
        expect(playerRole).toEqual("leader");
        done();
      }
    );
  });

  test("should player adjust gravity in solo game", (done) => {
    clientSocket_player_one.emit("start-game");

    const oldGravityInterval =
      serverSocket_player_one.data.userData.gravityInterval;

    setTimeout(() => {
      clientSocket_player_one.emit("gravitiy-setting", 500);
      clientSocket_player_one.on("map", async (map) => {
        const data = await getSocketData(io);
        serverSocket_player_one = data.player_one;
        const newGravityInterval =
          serverSocket_player_one.data.userData.gravityInterval;

        console.log({
          oldGravityInterval: oldGravityInterval,
          newGravityInterval,
        });
        expect(oldGravityInterval).toBeDefined();
        expect(newGravityInterval).toBeDefined();
        expect(newGravityInterval).not.toEqual(oldGravityInterval);
        done();
      });
    }, 500);
  });

  test("should join the game in multiplayer mode", (done) => {
    clientSocket_player_one.emit(
      "join",
      {
        playerName: "mfilahi",
        roomTitle: "1337",
        multiplayer: true,
        gravityInterval: 800,
      },
      (
        error: boolean,
        {
          playerName,
          roomId,
          roomTitle,
          multiplayer,
          gravityInterval,
          playerRole,
        }: userData
      ) => {
        expect(error).toBe(false);
        expect(playerName).toEqual("mfilahi");
        expect(typeof roomId === "string");
        expect(roomTitle).toEqual("1337");
        expect(multiplayer).toEqual(true);
        expect(gravityInterval).toEqual(800 || 500 || 100);
        expect(playerRole).toEqual("leader");

        // PLAYER_TWO
        clientSocket_player_two.emit(
          "join",
          {
            playerName: "ismail",
            roomTitle: "1337",
            multiplayer: true,
            gravityInterval: 800,
          },
          (
            error: boolean,
            {
              playerName,
              roomId,
              roomTitle,
              multiplayer,
              gravityInterval,
              playerRole,
            }: userData
          ) => {
            expect(error).toBe(false);
            expect(playerName).toEqual("ismail");
            expect(typeof roomId === "string");
            expect(roomTitle).toEqual("1337");
            expect(multiplayer).toEqual(true);
            expect(gravityInterval).toEqual(800 || 500 || 100);
            expect(playerRole).toEqual("follower");
            done();
          }
        );
      }
    );
  });

  test("should not pass if a follower try to start the game in multiplayer mode", (done) => {
    clientSocket_player_two.emit("start-order");
    setTimeout(() => {
      expect(serverSocket_player_two.data.userData.gameStatus).toEqual(
        "created"
      );
      done();
    }, 500);
  });

  test("leader the only one should start  the game in multiplayer mode", (done) => {
    clientSocket_player_one.emit("start-order");

    setTimeout(() => {
      expect(serverSocket_player_one.data.userData.gameStatus).toEqual(
        "started"
      );
      done();
    }, 500);
  });

  test("should the player move to shape down", (done) => {
    const { player } = serverSocket_player_one.data.gameData;
    const oldMap = player.getMap();
    expect(oldMap).toBeDefined();
    expect(oldMap).toBeInstanceOf(Array);
    expect(oldMap).toHaveLength(20);

    clientSocket_player_one.emit("down-key");
    clientSocket_player_one.on("map", (newMap) => {
      expect(newMap).toBeDefined();
      expect(newMap).toBeInstanceOf(Array);
      expect(newMap).toHaveLength(20);
      expect(oldMap).not.toEqual(newMap);
      done();
    });
  });

  test("should the player move to shape to the left", (done) => {
    const { player } = serverSocket_player_one.data.gameData;
    const oldMap = player.getMap();
    expect(oldMap).toBeDefined();
    expect(oldMap).toBeInstanceOf(Array);
    expect(oldMap).toHaveLength(20);

    clientSocket_player_one.emit("left-key");
    clientSocket_player_one.on("map", (newMap) => {
      expect(newMap).toBeDefined();
      expect(newMap).toBeInstanceOf(Array);
      expect(newMap).toHaveLength(20);
      expect(oldMap).not.toEqual(newMap);
      done();
    });
  });

  test("should the player rotate the shape", (done) => {
    const { player } = serverSocket_player_one.data.gameData;
    const oldMap = player.getMap();
    expect(oldMap).toBeDefined();
    expect(oldMap).toBeInstanceOf(Array);
    expect(oldMap).toHaveLength(20);
    // console.log("OLD MAP", JSON.parse(JSON.stringify(oldMap)));
    clientSocket_player_one.emit("rotate");
    clientSocket_player_one.on("map", (newMap) => {
      // console.log("NEW MAP", JSON.parse(JSON.stringify(newMap)));
      expect(newMap).toBeDefined();
      expect(newMap).toBeInstanceOf(Array);
      expect(newMap).toHaveLength(20);
      expect(oldMap).not.toEqual(newMap);
      done();
    });
  });

  test("should the player move to shape to the right", (done) => {
    const { player } = serverSocket_player_one.data.gameData;
    const oldMap = player.getMap();
    expect(oldMap).toBeDefined();
    expect(oldMap).toBeInstanceOf(Array);
    expect(oldMap).toHaveLength(20);
    clientSocket_player_one.emit("right-key");
    clientSocket_player_one.on("map", (newMap) => {
      expect(newMap).toBeDefined();
      expect(newMap).toBeInstanceOf(Array);
      expect(newMap).toHaveLength(20);
      expect(oldMap).not.toEqual(newMap);
      done();
    });
  });

  test("should the player drop the shape at the bottom instantly", (done) => {
    const { player } = serverSocket_player_one.data.gameData;
    const oldMap = player.getMap();
    expect(oldMap).toBeDefined();
    expect(oldMap).toBeInstanceOf(Array);
    expect(oldMap).toHaveLength(20);
    clientSocket_player_one.emit("space-key");
    clientSocket_player_one.on("map", (newMap) => {
      expect(newMap).toBeDefined();
      expect(newMap).toBeInstanceOf(Array);
      expect(newMap).toHaveLength(20);
      expect(oldMap).not.toEqual(newMap);
      done();
    });
  });
});
