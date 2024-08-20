package com.sample.user.util;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

public class ResponseBuilderTest {

    @Test
    public void testBuildSuccessResponse() {
        // テストデータのセットアップ
        String message = "Operation successful";
        Map<String, String> data = new HashMap<>();
        data.put("key1", "value1");
        data.put("key2", "value2");

        // メソッドの実行
        ResponseEntity<Map<String, Object>> response = ResponseBuilder.buildSuccessResponse(message, data);

        // 結果の検証
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo(HttpStatus.OK.value());
        assertThat(response.getBody().get("message")).isEqualTo(message);
        assertThat(response.getBody().get("data")).isEqualTo(data);
    }

    @Test
    public void testBuildSuccessResponseWithNullData() {
        // テストデータのセットアップ
        String message = "Operation successful";
        Map<String, String> data = null;

        // メソッドの実行
        ResponseEntity<Map<String, Object>> response = ResponseBuilder.buildSuccessResponse(message, data);

        // 結果の検証
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo(HttpStatus.OK.value());
        assertThat(response.getBody().get("message")).isEqualTo(message);
        assertThat(response.getBody().get("data")).isNull();
    }

    @Test
    public void testBuildErrorResponse() {
        // テストデータのセットアップ
        String message = "An error occurred";
        HttpStatus status = HttpStatus.BAD_REQUEST;

        // メソッドの実行
        ResponseEntity<Map<String, Object>> response = ResponseBuilder.buildErrorResponse(status, message);

        // 結果の検証
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo(status.value());
        assertThat(response.getBody().get("message")).isEqualTo(message);
        assertThat(response.getBody().get("data")).isNull();
    }

    @Test
    public void testBuildErrorResponseWithDifferentStatus() {
        // テストデータのセットアップ
        String message = "Resource not found";
        HttpStatus status = HttpStatus.NOT_FOUND;

        // メソッドの実行
        ResponseEntity<Map<String, Object>> response = ResponseBuilder.buildErrorResponse(status, message);

        // 結果の検証
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo(status.value());
        assertThat(response.getBody().get("message")).isEqualTo(message);
        assertThat(response.getBody().get("data")).isNull();
    }
}
