package com.sample.user;

import com.sample.user.repository.UserRepository;
import com.sample.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.is;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class UserApplicationTests {

	@Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    public void setUp() {
        userRepository.deleteAll();
    }

	@Test
	void contextLoads() {
	}

	@Test
    public void testRegisterUser_Success() throws Exception {
        String userJson = "{\"email\":\"user@example.com\", \"name\":\"John Doe\", \"password\":\"securepassword\"}";

        mockMvc.perform(post("/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("User registered successfully")));
    }

    @Test
    public void testRegisterUser_EmailAlreadyInUse() throws Exception {
        // 事前にユーザーを作成
        User existingUser = new User();
        existingUser.setEmail("user@example.com");
        existingUser.setName("Existing User");
        existingUser.setPassword("existingpassword");
        userRepository.save(existingUser);

        String userJson = "{\"email\":\"user@example.com\", \"name\":\"John Doe\", \"password\":\"securepassword\"}";

        mockMvc.perform(post("/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userJson))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message", is("Email is already in use")));
    }

    @Test
    public void testGetUser_Success() throws Exception {
        // 事前にユーザーを作成
        User existingUser = new User();
        existingUser.setEmail("user@example.com");
        existingUser.setName("John Doe");
        existingUser.setPassword("securepassword");
        userRepository.save(existingUser);

        String credentialsJson = "{\"email\":\"user@example.com\"}";

        mockMvc.perform(post("/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content(credentialsJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.email", is("user@example.com")))
                .andExpect(jsonPath("$.message", is("Login successful")));
    }

    @Test
    public void testGetUser_NotFound() throws Exception {
        String credentialsJson = "{\"email\":\"nonexistent@example.com\"}";

        mockMvc.perform(post("/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content(credentialsJson))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", is("User not Found")));
    }
}
