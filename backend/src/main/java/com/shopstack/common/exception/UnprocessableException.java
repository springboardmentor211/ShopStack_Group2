package com.shopstack.common.exception;

public class UnprocessableException extends RuntimeException {
    public UnprocessableException(String message) {
        super(message);
    }
}