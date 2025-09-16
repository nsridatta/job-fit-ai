package com.example.resumeai.configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.retry.RetryCallback;
import org.springframework.retry.RetryContext;
import org.springframework.retry.listener.RetryListenerSupport;
import org.springframework.stereotype.Component;


@Component
public class LoggingRetryListener extends RetryListenerSupport {
    private static final Logger LOG = LoggerFactory.getLogger(LoggingRetryListener.class);
    @Override
    public <T, E extends Throwable> void onError(RetryContext context, RetryCallback<T, E> callback, Throwable throwable) {
        LOG.warn("Retry attempt {} for error: {}", context.getRetryCount(), throwable.getMessage());
    }
}
