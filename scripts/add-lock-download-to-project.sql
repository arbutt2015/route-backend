-- Adds IS_LOCKED / IS_DOWNLOADED flags to PROJECT.
-- IS_LOCKED: project locked from the web UI (cannot be edited).
-- IS_DOWNLOADED: set later by the Route mobile app once the project is
-- downloaded — after that the project cannot be unlocked/edited.

ALTER TABLE dbo.PROJECT
ADD IS_LOCKED BIT NOT NULL
CONSTRAINT DF_PROJECT_IS_LOCKED DEFAULT (0);
GO

ALTER TABLE dbo.PROJECT
ADD IS_DOWNLOADED BIT NOT NULL
CONSTRAINT DF_PROJECT_IS_DOWNLOADED DEFAULT (0);
GO
