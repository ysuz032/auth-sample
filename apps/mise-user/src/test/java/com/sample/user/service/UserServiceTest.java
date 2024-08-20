package com.sample.user.service;

import com.sample.user.entity.User;
import com.sample.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    public void setUp() {
        // テスト対象のユーザーオブジェクトをセットアップ
        user = new User();
        user.setEmail("user@example.com");
        user.setName("John Doe");
        user.setPassword("securepassword");
    }

    @Test
    public void testFindUserByEmail_UserFound() {
        // UserRepository の findByEmail メソッドのモック設定
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        // サービスメソッドの実行
        Map<String, String> result = userService.findUserByEmail("user@example.com");

        // 結果の検証
        assertThat(result).isNotNull();
        assertThat(result.get("email")).isEqualTo("user@example.com");
        assertThat(result.get("name")).isEqualTo("John Doe");
        assertThat(result.get("password")).isEqualTo("securepassword");
    }

    @Test
    public void testFindUserByEmail_UserNotFound() {
        // UserRepository の findByEmail メソッドのモック設定（ユーザーが見つからない場合）
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // 例外がスローされることを検証
        assertThatThrownBy(() -> userService.findUserByEmail("nonexistent@example.com"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not Found");
    }

    @Test
    public void testRegisterUser_Success() {
        // UserRepository の existsByEmail メソッドのモック設定（メールが存在しない場合）
        when(userRepository.existsByEmail("user@example.com")).thenReturn(false);

        // サービスメソッドの実行
        userService.registerUser("user@example.com", "John Doe", "securepassword");

        // ユーザーが保存されることを検証
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    public void testRegisterUser_EmailAlreadyInUse() {
        // UserRepository の existsByEmail メソッドのモック設定（メールが既に存在する場合）
        when(userRepository.existsByEmail("user@example.com")).thenReturn(true);

        // 例外がスローされることを検証
        assertThatThrownBy(() -> userService.registerUser("user@example.com", "John Doe", "securepassword"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Email is already in use");

        // save メソッドが呼び出されていないことを検証
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void testRegisterUser_SaveFails() {
        // UserRepository の existsByEmail メソッドのモック設定（メールが存在しない場合）
        when(userRepository.existsByEmail("user@example.com")).thenReturn(false);

        // UserRepository の save メソッドがエラーをスローするように設定
        doThrow(new RuntimeException("Database error")).when(userRepository).save(any(User.class));

        // 例外がスローされることを検証
        assertThatThrownBy(() -> userService.registerUser("user@example.com", "John Doe", "securepassword"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Database error");
    }

    @Test
    public void testDeleteUserByEmail_Success() {
        // findByEmail メソッドがユーザーを返す場合のモック設定
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

        // サービスメソッドの実行
        userService.deleteUserByEmail("user@example.com");

        // ユーザーが削除されたことを確認
        verify(userRepository, times(1)).delete(user);
    }

    @Test
    public void testDeleteUserByEmail_UserNotFound() {
        // findByEmail メソッドが空のOptionalを返す場合のモック設定
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // 例外がスローされることを確認
        assertThatThrownBy(() -> userService.deleteUserByEmail("nonexistent@example.com"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not Found");

        // ユーザーが削除されていないことを確認
        verify(userRepository, never()).delete(any(User.class));
    }
}
