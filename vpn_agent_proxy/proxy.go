package main

import (
	"fmt"
	"io"
	"net"
)

func main() {
	// Listen on local port
	localAddr, err := net.ResolveTCPAddr("tcp", "0.0.0.0:8120")
	if err != nil {
		fmt.Println("Error resolving local address:", err)
		return
	}
	listener, err := net.ListenTCP("tcp", localAddr)
	if err != nil {
		fmt.Println("Error listening on local port:", err)
		return
	}
	defer listener.Close()

	// Vpn agent address
	remoteAddr, err := net.ResolveTCPAddr("tcp", "127.0.0.1:8118")
	if err != nil {
		fmt.Println("Error resolving remote address:", err)
		return
	}

	for {
		conn, err := listener.AcceptTCP()
		if err != nil {
			fmt.Println("Error accepting connection:", err)
			continue
		}

		// Modify source IP address
		localIP := net.ParseIP("127.0.0.1")
		conn.LocalAddr().(*net.TCPAddr).IP = localIP

		// Establish a connection to a remote server
		remoteConn, err := net.DialTCP("tcp", nil, remoteAddr)
		if err != nil {
			fmt.Println("Error connecting to remote server:", err)
			conn.Close()
			continue
		}

		// Modify destination IP address
		remoteIP := net.ParseIP("127.0.0.1")
		remoteConn.RemoteAddr().(*net.TCPAddr).IP = remoteIP

		// Forward data
		go func() {
			_, err := io.Copy(remoteConn, conn)
			if err != nil {
				fmt.Println("Error copying data to remote server:", err)
			}
			remoteConn.Close()
			conn.Close()
		}()

		go func() {
			_, err := io.Copy(conn, remoteConn)
			if err != nil {
				fmt.Println("Error copying data to local client:", err)
			}
			remoteConn.Close()
			conn.Close()
		}()
	}
}
