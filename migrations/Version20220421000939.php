<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220421000939 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE user_residence');
        $this->addSql('ALTER TABLE rent DROP FOREIGN KEY FK_2784DCC7E3C61F9');
        $this->addSql('DROP INDEX IDX_2784DCC7E3C61F9 ON rent');
        $this->addSql('ALTER TABLE rent ADD first_comment VARCHAR(255) DEFAULT NULL, ADD first_signature VARCHAR(255) DEFAULT NULL, ADD first_validate_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', ADD second_comment VARCHAR(255) DEFAULT NULL, ADD second_signature VARCHAR(255) DEFAULT NULL, ADD second_validate_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', ADD third_comment VARCHAR(255) DEFAULT NULL, ADD third_signature VARCHAR(255) DEFAULT NULL, ADD third_validate_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', ADD fourth_comment VARCHAR(255) DEFAULT NULL, ADD fourth_signature VARCHAR(255) DEFAULT NULL, ADD fourth_validate_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', DROP tenant_comments, DROP tenant_signature, DROP tenant_validated_at, DROP representative_comments, DROP representative_signature, DROP representative_validated_at, CHANGE owner_id representative_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE rent ADD CONSTRAINT FK_2784DCCFC3FF006 FOREIGN KEY (representative_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_2784DCCFC3FF006 ON rent (representative_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_residence (user_id INT NOT NULL, residence_id INT NOT NULL, INDEX IDX_3C7D5C7A76ED395 (user_id), INDEX IDX_3C7D5C78B225FBD (residence_id), PRIMARY KEY(user_id, residence_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE user_residence ADD CONSTRAINT FK_3C7D5C7A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_residence ADD CONSTRAINT FK_3C7D5C78B225FBD FOREIGN KEY (residence_id) REFERENCES residence (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE rent DROP FOREIGN KEY FK_2784DCCFC3FF006');
        $this->addSql('DROP INDEX IDX_2784DCCFC3FF006 ON rent');
        $this->addSql('ALTER TABLE rent ADD tenant_comments LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, ADD tenant_signature VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, ADD tenant_validated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', ADD representative_comments LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, ADD representative_signature VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, ADD representative_validated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', DROP first_comment, DROP first_signature, DROP first_validate_at, DROP second_comment, DROP second_signature, DROP second_validate_at, DROP third_comment, DROP third_signature, DROP third_validate_at, DROP fourth_comment, DROP fourth_signature, DROP fourth_validate_at, CHANGE representative_id owner_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE rent ADD CONSTRAINT FK_2784DCC7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_2784DCC7E3C61F9 ON rent (owner_id)');
    }
}
