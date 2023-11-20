import tkinter as tk
from tkinter import scrolledtext
from tkinter import Listbox
from threading import Thread
import socket
import os

class ChatroomGUI:
    def __init__(self, master, host, port):
        self.master = master
        self.master.title("Chatroom")
        self.host = host
        self.port = port
        self.create_widgets()
        self.active_users = set()

        self.create_widgets()

        # Initialize socket
        self.client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.client_socket.connect((self.host, self.port))

        # Start a thread to receive messages
        receive_thread = Thread(target=self.receive_messages)
        receive_thread.start()

    def create_widgets(self):
        self.chat_area = scrolledtext.ScrolledText(self.master, state='disabled', height=20, width=40)
        self.chat_area.grid(row=0, column=0, padx=10, pady=10, sticky=tk.NSEW)

        self.user_list = Listbox(self.master, height=20, width=20)
        self.user_list.grid(row=0, column=1, padx=10, pady=10, rowspan=20, sticky=tk.NS)

        self.message_entry = tk.Entry(self.master, width=40)
        self.message_entry.grid(row=1, column=0, padx=10, pady=10, sticky=tk.EW)

        send_button = tk.Button(self.master, text="Send", command=self.send_message)
        send_button.grid(row=1, column=1, padx=10, pady=10, sticky=tk.NS)

       # Bind the Enter key to the send_message function
        self.master.bind('<Return>', lambda event: self.send_message())

        # Column and row weights to make them expand with resizing
        self.master.columnconfigure(0, weight=1)
        self.master.columnconfigure(1, weight=1)
        self.master.rowconfigure(0, weight=1)
        self.master.rowconfigure(1, weight=0)

    def send_message(self):
        message = self.message_entry.get()
        if message:
            self.client_socket.send(message.encode('utf-8'))
            self.message_entry.delete(0, 'end')

    def receive_messages(self):
        while True:
            try:
                message = self.client_socket.recv(1024).decode('utf-8')
                if message.startswith("NOTI"):
                    name = message.split(' ')
                    self.update_user_list('@'+name[1])
                    self.update_chat_area(message)
                else:
                    self.update_chat_area(message)
            except ConnectionAbortedError:
                break

    def update_chat_area(self, message):
        self.chat_area.configure(state='normal')

    # Assuming "/users" should be highlighted
        if message.startswith("NOTI"):
            self.chat_area.insert(tk.END, message[:5], 'users_tag')
            self.chat_area.insert(tk.END, message[5:] + '\n')
        elif message.startswith("CHAT"):
            self.chat_area.insert(tk.END, message[:5], 'chat_tag')
            self.chat_area.insert(tk.END, message[5:] + '\n')
        else:
            self.chat_area.insert(tk.END, message + '\n')

        self.chat_area.configure(state='disabled')

    # Scroll to the end to show the latest messages
        self.chat_area.see(tk.END)

    # Update tags
        self.chat_area.tag_configure('users_tag', foreground='blue', background='red', font=('Helvetica', 10, 'bold'))
        self.chat_area.tag_configure('chat_tag', foreground='green', font=('Helvetica', 10, 'bold'))

    def update_user_list(self, users):
        user_list = users.split(',')
        self.active_users = set(user_list)
        #self.user_list.delete(0, tk.END)
        for user in self.active_users:
            self.user_list.insert(tk.END, user)
        
        #self.active_users.tag_configure('list_tag', foreground='blue', font=('Helvetica', 10, 'bold'))

    def close_window(self):
        leave = 'LEAV'
        self.client_socket.send(leave.encode('utf-8'))
        self.client_socket.close()
        self.master.destroy()

if __name__ == "__main__":
    # Replace 'your_server_ip' and 'your_server_port' with your actual server IP and port
    hostname = socket.gethostname()
    server_ip = socket.gethostbyname(hostname)
    server_port = 90
    root = tk.Tk()
    chatroom_gui = ChatroomGUI(root, server_ip, server_port)
    root.protocol("WM_DELETE_WINDOW", chatroom_gui.close_window)

    root.mainloop()
