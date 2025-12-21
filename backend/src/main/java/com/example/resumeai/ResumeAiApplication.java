package com.example.resumeai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;

@SpringBootApplication
public class ResumeAiApplication {
  public static void main(String[] args) {
    // Only load .env file for local development (not in production)
    if (isLocalDevelopment(args)) {
      loadEnvFile();
    }

    SpringApplication.run(ResumeAiApplication.class, args);
  }

  /**
   * Checks if running in local development mode.
   * Production environments should have OPENROUTER_API_KEY already set.
   */
  private static boolean isLocalDevelopment(String[] args) {
    // Check if we're in production (env var already set by cloud platform)
    String apiKey = System.getenv("OPENROUTER_API_KEY");
    if (apiKey != null && !apiKey.isEmpty()) {
      return false; // Production - API key is already set
    }

    // Check for explicit production profile
    String activeProfile = System.getenv("SPRING_PROFILES_ACTIVE");
    if (activeProfile != null && activeProfile.contains("prod")) {
      return false; // Production profile active
    }

    // Check command line args for production profile
    boolean isProdProfile = Arrays.stream(args)
        .anyMatch(arg -> arg.contains("profiles.active=prod") || arg.contains("prod"));

    return !isProdProfile;
  }

  /**
   * Loads environment variables from .env file for local development only.
   */
  private static void loadEnvFile() {
    String[] possiblePaths = {
        ".env",
        "backend/.env",
        "../backend/.env"
    };

    for (String pathStr : possiblePaths) {
      Path path = Paths.get(pathStr);
      if (Files.exists(path)) {
        try {
          System.out.println("[LOCAL DEV] Loading environment from: " + path.toAbsolutePath());
          Files.lines(path)
              .filter(line -> !line.startsWith("#") && line.contains("="))
              .forEach(line -> {
                String[] parts = line.split("=", 2);
                if (parts.length == 2) {
                  String key = parts[0].trim();
                  String value = parts[1].trim();
                  if (System.getProperty(key) == null) {
                    System.setProperty(key, value);
                  }
                }
              });
          return;
        } catch (IOException e) {
          System.err.println("[LOCAL DEV] Error reading .env: " + e.getMessage());
        }
      }
    }
  }
}
