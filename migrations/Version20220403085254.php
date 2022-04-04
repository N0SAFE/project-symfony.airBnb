<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220403085254 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE residence_association');
        $this->addSql('ALTER TABLE residence ADD user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE residence ADD CONSTRAINT FK_3275823A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_3275823A76ED395 ON residence (user_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE residence_association (id INT AUTO_INCREMENT NOT NULL, representative_id INT DEFAULT NULL, residence_id INT DEFAULT NULL, UNIQUE INDEX UNIQ_9AE682378B225FBD (residence_id), INDEX IDX_9AE68237FC3FF006 (representative_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE residence_association ADD CONSTRAINT FK_9AE68237FC3FF006 FOREIGN KEY (representative_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE residence_association ADD CONSTRAINT FK_9AE682378B225FBD FOREIGN KEY (residence_id) REFERENCES residence (id)');
        $this->addSql('ALTER TABLE residence DROP FOREIGN KEY FK_3275823A76ED395');
        $this->addSql('DROP INDEX IDX_3275823A76ED395 ON residence');
        $this->addSql('ALTER TABLE residence DROP user_id');
    }
}
