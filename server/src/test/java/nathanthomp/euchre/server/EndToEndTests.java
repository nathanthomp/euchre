package nathanthomp.euchre.server;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.web.socket.client.WebSocketClient;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;

@SpringBootTest
public class EndToEndTests {

    @LocalServerPort
    private int port;

    private List<WebSocketClient> clients = new ArrayList<>();

    @BeforeEach
    void createClients() {
        String wsUrl = "ws://localhost:" + this.port + "/ws";

        for (int i = 0; i < 4; i++) {
            WebSocketClient client = new StandardWebSocketClient();
        }

    }
}
