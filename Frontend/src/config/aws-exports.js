const awsConfig = {
  "aws_project_region": "eu-west-1",
  "aws_cognito_region": "eu-west-1",
  "aws_user_pools_id": "eu-west-1_BiM4xuFmI",
  "aws_user_pools_web_client_id": "h8om33rplqurkhsrh9t6ae7m7",
  "oauth": {
      "domain": "https://meeting-notes-gen.auth.eu-west-1.amazoncognito.com",
      "scope": [
          "email",
          "openid",
          "profile",
      ],
      "redirectSignIn": "http://localhost:3000/",
      "responseType": "code"
  },
  "federationTarget": "COGNITO_USER_POOLS",
  "aws_cognito_username_attributes": [
      "EMAIL"
  ],
  "aws_cognito_social_providers": [],
  "aws_cognito_signup_attributes": [
      "EMAIL"
  ],
  "aws_cognito_mfa_configuration": "OFF",
  "aws_cognito_mfa_types": [
      "SMS"
  ],
  "aws_cognito_password_protection_settings": {
      "passwordPolicyMinLength": 8,
      "passwordPolicyCharacters": []
  },
  "aws_cognito_verification_mechanisms": [
      "EMAIL"
  ]
};

  export default awsConfig;
