package com.sample.user.controller;

import com.sample.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private Map<String, String> userCredentials;

    @BeforeEach
    public void setUp() {
        // テストで使用するユーザーの認証情報をセットアップ
        userCredentials = new HashMap<>();
        userCredentials.put("email", "user@example.com");
        userCredentials.put("name", "John Doe");
        userCredentials.put("password", "securepassword");
    }

    @SuppressWarnings("unchecked")
    @Test
    public void testGetUser_Success() {
        // findUserByEmail メソッドがユーザーデータを返す場合のモック設定
        Map<String, String> userData = new HashMap<>();
        userData.put("email", "user@example.com");
        userData.put("name", "Sample User1");
        userData.put("password", "dummypassword");
        userData.put("id", "1");

        when(userService.findUserByEmail(anyString())).thenReturn(userData);

        // メソッド実行
        ResponseEntity<Map<String, Object>> response = userController.getUser(userCredentials);

        // 結果の検証
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(((Map<String, String>) response.getBody().get("data")).get("email")).isEqualTo("user@example.com");
        assertThat(response.getBody().get("message")).isEqualTo("Login successful");
        assertThat(response.getBody().get("status")).isEqualTo(200);
        verify(userService, times(1)).findUserByEmail(anyString());
    }

    @Test
    public void testGetUser_UserNotFound() {
        // findUserByEmail メソッドが例外をスローする場合のモック設定
        when(userService.findUserByEmail(anyString())).thenThrow(new RuntimeException("User not Found"));

        // メソッド実行
        ResponseEntity<Map<String, Object>> response = userController.getUser(userCredentials);

        // 結果の検証
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        verify(userService, times(1)).findUserByEmail(anyString());
    }

    @Test
    public void testRegisterUser_Success() {
        // メソッド実行
        ResponseEntity<Map<String, Object>> response = userController.registerUser(userCredentials);

        // 結果の検証
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(userService, times(1)).registerUser(anyString(), anyString(), anyString());
    }

    @Test
    public void testRegisterUser_EmailAlreadyInUse() {
        // registerUser メソッドが例外をスローする場合のモック設定
        doThrow(new RuntimeException("Email is already in use."))
                .when(userService).registerUser(anyString(), anyString(), anyString());

        // メソッド実行
        ResponseEntity<Map<String, Object>> response = userController.registerUser(userCredentials);

        // 結果の検証
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        verify(userService, times(1)).registerUser(anyString(), anyString(), anyString());
    }

    @Test
    public void testDeleteUser_Success() {
        // コントローラーメソッドの実行
        ResponseEntity<Map<String, Object>> response = userController.deleteUser(userCredentials);

        // 結果の検証
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("message")).isEqualTo("User deleted successfully");

        // deleteUserByEmail メソッドが呼び出されたことを確認
        verify(userService, times(1)).deleteUserByEmail(anyString());
    }

    @Test
    public void testDeleteUser_UserNotFound() {
        // deleteUserByEmail メソッドが例外をスローする場合のモック設定
        doThrow(new RuntimeException("User not Found")).when(userService)
                .deleteUserByEmail(anyString());

        // コントローラーメソッドの実行
        ResponseEntity<Map<String, Object>> response = userController.deleteUser(userCredentials);

        // 結果の検証
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("message")).isEqualTo("User not Found");
    }
}
