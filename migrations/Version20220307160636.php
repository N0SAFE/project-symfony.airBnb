<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220307160636 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE rent DROP FOREIGN KEY FK_2784DCC4384A887');
        $this->addSql('ALTER TABLE rent DROP FOREIGN KEY FK_2784DCC60D47263');
        $this->addSql('DROP INDEX IDX_2784DCC60D47263 ON rent');
        $this->addSql('DROP INDEX IDX_2784DCC4384A887 ON rent');
        $this->addSql('ALTER TABLE rent ADD tenant_id INT NOT NULL, ADD residence_id INT NOT NULL, DROP tenant_id_id, DROP residence_id_id');
        $this->addSql('ALTER TABLE rent ADD CONSTRAINT FK_2784DCC9033212A FOREIGN KEY (tenant_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE rent ADD CONSTRAINT FK_2784DCC8B225FBD FOREIGN KEY (residence_id) REFERENCES residence (id)');
        $this->addSql('CREATE INDEX IDX_2784DCC9033212A ON rent (tenant_id)');
        $this->addSql('CREATE INDEX IDX_2784DCC8B225FBD ON rent (residence_id)');
        $this->addSql('ALTER TABLE residence DROP FOREIGN KEY FK_32758238FDDAB70');
        $this->addSql('ALTER TABLE residence DROP FOREIGN KEY FK_3275823C01675FE');
        $this->addSql('DROP INDEX IDX_32758238FDDAB70 ON residence');
        $this->addSql('DROP INDEX IDX_3275823C01675FE ON residence');
        $this->addSql('ALTER TABLE residence ADD owner_id INT NOT NULL, ADD representative_id INT NOT NULL, DROP owner_id_id, DROP representative_id_id');
        $this->addSql('ALTER TABLE residence ADD CONSTRAINT FK_32758237E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE residence ADD CONSTRAINT FK_3275823FC3FF006 FOREIGN KEY (representative_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_32758237E3C61F9 ON residence (owner_id)');
        $this->addSql('CREATE INDEX IDX_3275823FC3FF006 ON residence (representative_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE rent DROP FOREIGN KEY FK_2784DCC9033212A');
        $this->addSql('ALTER TABLE rent DROP FOREIGN KEY FK_2784DCC8B225FBD');
        $this->addSql('DROP INDEX IDX_2784DCC9033212A ON rent');
        $this->addSql('DROP INDEX IDX_2784DCC8B225FBD ON rent');
        $this->addSql('ALTER TABLE rent ADD tenant_id_id INT NOT NULL, ADD residence_id_id INT NOT NULL, DROP tenant_id, DROP residence_id');
        $this->addSql('ALTER TABLE rent ADD CONSTRAINT FK_2784DCC4384A887 FOREIGN KEY (residence_id_id) REFERENCES residence (id)');
        $this->addSql('ALTER TABLE rent ADD CONSTRAINT FK_2784DCC60D47263 FOREIGN KEY (tenant_id_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_2784DCC60D47263 ON rent (tenant_id_id)');
        $this->addSql('CREATE INDEX IDX_2784DCC4384A887 ON rent (residence_id_id)');
        $this->addSql('ALTER TABLE residence DROP FOREIGN KEY FK_32758237E3C61F9');
        $this->addSql('ALTER TABLE residence DROP FOREIGN KEY FK_3275823FC3FF006');
        $this->addSql('DROP INDEX IDX_32758237E3C61F9 ON residence');
        $this->addSql('DROP INDEX IDX_3275823FC3FF006 ON residence');
        $this->addSql('ALTER TABLE residence ADD owner_id_id INT NOT NULL, ADD representative_id_id INT NOT NULL, DROP owner_id, DROP representative_id');
        $this->addSql('ALTER TABLE residence ADD CONSTRAINT FK_32758238FDDAB70 FOREIGN KEY (owner_id_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE residence ADD CONSTRAINT FK_3275823C01675FE FOREIGN KEY (representative_id_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_32758238FDDAB70 ON residence (owner_id_id)');
        $this->addSql('CREATE INDEX IDX_3275823C01675FE ON residence (representative_id_id)');
    }
}
