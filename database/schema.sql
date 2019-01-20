SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema shopify_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `shopify_db` DEFAULT CHARACTER SET utf8 ;
USE `shopify_db` ;

-- -----------------------------------------------------
-- Table `shopify_db`.`PRODUCTS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `shopify_db`.`PRODUCTS` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `TITLE` VARCHAR(45) NOT NULL,
  `PRICE` NUMERIC(19,4) NOT NULL,
  `INVENTORY_COUNT` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`ID`),
  UNIQUE INDEX `ID_UNIQUE` (`ID` ASC))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `shopify_db`.`CART_ENTRY`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `shopify_db`.`CART_ENTRY` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `CART_ID` INT NOT NULL,
  `PRODUCT_ID` INT NOT NULL,
  CONSTRAINT `fk_PRODUCT_ID1`
    FOREIGN KEY (`PRODUCT_ID`)
    REFERENCES `shopify_db`.`PRODUCTS` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  UNIQUE INDEX `ID_UNIQUE` (`ID` ASC))
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
