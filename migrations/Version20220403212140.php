<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220403212140 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_residence (user_id INT NOT NULL, residence_id INT NOT NULL, INDEX IDX_3C7D5C7A76ED395 (user_id), INDEX IDX_3C7D5C78B225FBD (residence_id), PRIMARY KEY(user_id, residence_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_residence ADD CONSTRAINT FK_3C7D5C7A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_residence ADD CONSTRAINT FK_3C7D5C78B225FBD FOREIGN KEY (residence_id) REFERENCES residence (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE residence DROP FOREIGN KEY FK_3275823A76ED395');
        $this->addSql('DROP INDEX IDX_3275823A76ED395 ON residence');
        $this->addSql('ALTER TABLE residence DROP user_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE user_residence');
        $this->addSql('ALTER TABLE residence ADD user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE residence ADD CONSTRAINT FK_3275823A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_3275823A76ED395 ON residence (user_id)');
    }
}
