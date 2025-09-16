package com.example.resumeai.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.retry.RetryCallback;
import org.springframework.retry.RetryContext;
import org.springframework.retry.backoff.ExponentialBackOffPolicy;
import org.springframework.retry.listener.RetryListenerSupport;
import org.springframework.retry.policy.SimpleRetryPolicy;
import org.springframework.retry.support.RetryTemplate;

@Configuration
public class RetryConfig {

    private static final Logger LOG = LoggerFactory.getLogger(RetryConfig.class);

    @Bean
    public RetryTemplate retryTemplate() {
        RetryTemplate retryTemplate = new RetryTemplate();
        
        // Configure retry policy
        SimpleRetryPolicy retryPolicy = new SimpleRetryPolicy();
        retryPolicy.setMaxAttempts(5); // Maximum of 5 attempts
        
        // Configure backoff policy (exponential backoff with jitter)
        ExponentialBackOffPolicy backOffPolicy = new ExponentialBackOffPolicy();
        backOffPolicy.setInitialInterval(1000); // 1 second initial delay
        backOffPolicy.setMultiplier(2.0); // Double the delay each retry
        backOffPolicy.setMaxInterval(10000); // Maximum 10 seconds delay
        
        retryTemplate.setRetryPolicy(retryPolicy);
        retryTemplate.setBackOffPolicy(backOffPolicy);
        
        // Register retry listener for logging
        retryTemplate.registerListener(new RetryListenerSupport() {
            @Override
            public <T, E extends Throwable> void onError(
                RetryContext context, 
                RetryCallback<T, E> callback, 
                Throwable throwable
            ) {
                LOG.warn("Retry attempt {} for error: {}", 
                    context.getRetryCount(), 
                    throwable.getMessage()
                );
                // Note: Don't log the full prompt here to avoid PII exposure
            }
        });
        
        return retryTemplate;
    }
}