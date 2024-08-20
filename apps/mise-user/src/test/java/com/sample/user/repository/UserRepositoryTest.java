package com.sample.user.repository;

import com.sample.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    private User user;

    @BeforeEach
    public void setUp() {
        user = new User();
        user.setEmail("user@example.com");
        user.setName("John Doe");
        user.setPassword("securepassword");
    }

    @Test
    public void testFindByEmail() {
        // データベースにユーザーを保存
        userRepository.save(user);

        // 保存したユーザーを検索
        Optional<User> foundUser = userRepository.findByEmail("user@example.com");

        // ユーザーが見つかったことを確認
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getEmail()).isEqualTo(user.getEmail());
        assertThat(foundUser.get().getName()).isEqualTo(user.getName());
        assertThat(foundUser.get().getPassword()).isEqualTo(user.getPassword());
    }

    @Test
    public void testExistsByEmail() {
        // データベースにユーザーを保存
        userRepository.save(user);

        // ユーザーが存在するか確認
        boolean exists = userRepository.existsByEmail("user@example.com");

        // 結果を検証
        assertThat(exists).isTrue();
    }

    @Test
    public void testFindByEmail_NotFound() {
        // 存在しないユーザーを検索
        Optional<User> foundUser = userRepository.findByEmail("nonexistent@example.com");

        // ユーザーが見つからないことを確認
        assertThat(foundUser).isNotPresent();
    }

    @Test
    public void testExistsByEmail_NotFound() {
        // 存在しないメールアドレスを確認
        boolean exists = userRepository.existsByEmail("nonexistent@example.com");

        // 結果を検証
        assertThat(exists).isFalse();
    }
}
