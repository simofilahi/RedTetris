import { Socket } from "socket.io";
import { userData } from "../../client/src/interfaces";

const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");

jest.setTimeout(50000);

describe("my awesome project", () => {
  let io: any, serverSocket: any, clientSocket: any;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test("Client socket should be connected to server socket", () => {
    expect(serverSocket.connected).toEqual(true);
  });

  test("User Should be able to join a game room [SOLO]", () => {
    clientSocket.emit(
      "join",
      { roomTitle: "testRoom", playerName: "Ismail", multiplayer: false },
      (
        error: Boolean,
        {
          roomTitle,
          playerName,
          roomId,
          playerRole,
          gravityInterval,
          multiplayer,
        }: userData
      ) => {
        expect(roomTitle).toEqual("testRoom");
        expect(playerName).toEqual("Ismail");
        expect(roomId).toBeInstanceOf(String);
        expect(playerRole).toEqual("leader");
        expect(gravityInterval).toEqual(1000);
        expect(multiplayer).toEqual(false);
      }
    );
  });
});
