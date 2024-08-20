package com.sample.user.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;

public class UserTest {

    private User user;

    @BeforeEach
    public void setUp() {
        user = new User();
    }

    @Test
    public void testGettersAndSetters() {
        // テストデータのセットアップ
        Long id = 1L;
        String email = "user@example.com";
        String name = "John Doe";
        String password = "securepassword";

        // 値の設定
        user.setId(id);
        user.setEmail(email);
        user.setName(name);
        user.setPassword(password);

        // ゲッターを使って値を取得し、確認
        assertThat(user.getId()).isEqualTo(id);
        assertThat(user.getEmail()).isEqualTo(email);
        assertThat(user.getName()).isEqualTo(name);
        assertThat(user.getPassword()).isEqualTo(password);
    }

    @Test
    public void testToMap() {
        // テストデータのセットアップ
        Long id = 1L;
        String email = "user@example.com";
        String name = "John Doe";
        String password = "securepassword";

        // 値の設定
        user.setId(id);
        user.setEmail(email);
        user.setName(name);
        user.setPassword(password);

        // toMap メソッドを呼び出して結果を確認
        Map<String, String> map = user.toMap();

        assertThat(map).isNotNull();
        assertThat(map.get("id")).isEqualTo(id.toString());
        assertThat(map.get("email")).isEqualTo(email);
        assertThat(map.get("name")).isEqualTo(name);
        assertThat(map.get("password")).isEqualTo(password);
    }

    @Test
    public void testToMapWithNullId() {
        // テストデータのセットアップ
        String email = "user@example.com";
        String name = "John Doe";
        String password = "securepassword";

        // 値の設定
        user.setEmail(email);
        user.setName(name);
        user.setPassword(password);

        // toMap メソッドを呼び出して結果を確認
        Map<String, String> map = user.toMap();

        assertThat(map).isNotNull();
        assertThat(map.get("id")).isNull();
        assertThat(map.get("email")).isEqualTo(email);
        assertThat(map.get("name")).isEqualTo(name);
        assertThat(map.get("password")).isEqualTo(password);
    }
}
