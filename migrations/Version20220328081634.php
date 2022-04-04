<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220328081634 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE residence_association (id INT AUTO_INCREMENT NOT NULL, representative_id INT DEFAULT NULL, residence_id INT DEFAULT NULL, INDEX IDX_9AE68237FC3FF006 (representative_id), UNIQUE INDEX UNIQ_9AE682378B225FBD (residence_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE residence_association ADD CONSTRAINT FK_9AE68237FC3FF006 FOREIGN KEY (representative_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE residence_association ADD CONSTRAINT FK_9AE682378B225FBD FOREIGN KEY (residence_id) REFERENCES residence (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE residence_association');
    }
}
