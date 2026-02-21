import { Socket } from "socket.io-client";

export type SocketContext = Socket | null

export type SocketSuccessResponse = {
    status: "success";
    message: "string";
    // eslint-disable-next-line
    data: any
}
export type SocketErrorResponse = {
    status: "error";
    error: "string";
}

export type SocketResponse = SocketSuccessResponse | SocketErrorResponse

