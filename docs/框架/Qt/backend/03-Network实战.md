AL 项目需要 HTTP 客户端（视频解析）、TCP Server（流媒体）、HTTP Server（文件互传/移动端联动）。本章基于 Qt 6.4+ 官方文档。

## QNetworkAccessManager — HTTP 客户端

等价于 fetch / axios。全应用共享一个实例即可。

### GET 请求

```cpp
#include <QNetworkAccessManager>
#include <QNetworkReply>

void getJson(QNetworkAccessManager *nam, const QUrl &url) {
    QNetworkRequest req(url);
    req.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    QNetworkReply *reply = nam->get(req);
    connect(reply, &QNetworkReply::finished, [reply]() {
        if (reply->error() == QNetworkReply::NoError) {
            QByteArray data = reply->readAll();
            // 处理数据
        } else {
            qWarning() << "HTTP error:" << reply->errorString();
        }
        reply->deleteLater();  // 用完必须 deleteLater
    });
}
```

### POST 请求

```cpp
void postJson(QNetworkAccessManager *nam, const QUrl &url) {
    QNetworkRequest req(url);
    req.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    QJsonObject payload{{"name", "AL"}};
    QNetworkReply *reply = nam->post(req, QJsonDocument(payload).toJson());
    connect(reply, &QNetworkReply::finished, [reply]() {
        int status = reply->attribute(
            QNetworkRequest::HttpStatusCodeAttribute).toInt();
        reply->deleteLater();
    });
}
```

### 配置

```cpp
QNetworkAccessManager *nam = new QNetworkAccessManager(this);
nam->setTransferTimeout(30000);  // 30秒超时
nam->setRedirectPolicy(
    QNetworkRequest::NoLessSafeRedirectPolicy);
```

## QTcpServer / QTcpSocket — TCP 通信

### 回显服务器

```cpp
QTcpServer server;
connect(&server, &QTcpServer::newConnection, [&server]() {
    while (server.hasPendingConnections()) {
        QTcpSocket *sock = server.nextPendingConnection();
        connect(sock, &QTcpSocket::readyRead, [sock]() {
            sock->write(sock->readAll());  // echo
        });
        connect(sock, &QTcpSocket::disconnected,
                sock, &QObject::deleteLater);
    }
});
server.listen(QHostAddress::Any, 8080);
```

### 客户端

```cpp
QTcpSocket socket;
socket.connectToHost("127.0.0.1", 8080);
connect(&socket, &QTcpSocket::connected, [&socket]() {
    socket.write("hello");
    socket.flush();
});
connect(&socket, &QTcpSocket::readyRead, [&socket]() {
    QByteArray data = socket.readAll();
});
```

## QUdpSocket — UDP 通信

适用于局域网发现、状态广播：

```cpp
// 接收端
QUdpSocket *udp = new QUdpSocket(this);
udp->bind(QHostAddress::LocalHost, 7755);
connect(udp, &QUdpSocket::readyRead, [udp]() {
    while (udp->hasPendingDatagrams()) {
        QNetworkDatagram dg = udp->receiveDatagram();
        // dg.data() / dg.senderAddress() / dg.senderPort()
    }
});

// 发送端（无需 bind）
QUdpSocket sender;
sender.writeDatagram("ping", QHostAddress::LocalHost, 7755);
```

## QHttpServer — 嵌入式 HTTP 服务

Qt 6.4+ 正式模块，用于文件互传和移动端联动。vcpkg 包名 `qt-httpserver`。

### 基本路由

```cpp
#include <QHttpServer>

QHttpServer server;

// GET /api/users/42 — 路径参数自动类型转换
server.route("/api/users/<arg>", QHttpServerRequest::Method::Get,
    [](int id, const QHttpServerRequest &req) {
        QJsonObject obj{{"id", id}, {"path", req.url().path()}};
        return QHttpServerResponse(obj);  // 自动序列化 JSON
    });

// POST /api/users
server.route("/api/users", QHttpServerRequest::Method::Post,
    [](const QHttpServerRequest &req) {
        QJsonObject body = QJsonDocument::fromJson(req.body()).object();
        body.insert("received", true);
        return QHttpServerResponse(body,
            QHttpServerResponder::StatusCode::Created);
    });
```

### 启动服务

```cpp
auto tcpServer = new QTcpServer;
tcpServer->listen(QHostAddress::Any, 7528);
server.bind(tcpServer);
```

### AL 项目的路由设计

| 路由 | 方法 | 用途 |
|------|------|------|
| `/files` | GET | 文件列表 |
| `/upload` | POST | 文件上传 |
| `/download/<arg>` | GET | 文件下载 |
| `/convert` | POST | 格式转换 |

### 安全设计

- **Token 认证**：请求头携带随机 Token
- **设备白名单**：DeviceAuth 管理已授权设备
- **监听地址**：`0.0.0.0:7528`（移动端服务），流媒体相关仅 `127.0.0.1`

## CMake 配置

```cmake
find_package(Qt6 REQUIRED COMPONENTS Network HttpServer)
target_link_libraries(app PRIVATE
    Qt6::Network Qt6::HttpServer)
```

## 注意事项

1. QNetworkReply 用完必须 `deleteLater()`，不要在 finished 回调里直接 delete
2. 上传大文件时考虑流式处理，避免一次性载入内存
3. QHttpServer 需单独安装 vcpkg 包：`vcpkg install qt-httpserver`
4. 跨平台后保持路由与响应格式一致，便于移动端对接