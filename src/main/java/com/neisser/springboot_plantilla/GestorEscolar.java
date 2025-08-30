package com.neisser.springboot_plantilla;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class GestorEscolar {
    public static void main(String[] args) {
        SpringApplication.run(GestorEscolar.class, args);
}
}