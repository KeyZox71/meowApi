{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs =
    inputs@{ self, nixpkgs, ... }:
    let
      supportedSystems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forEachSupportedSystem =
        f:
        nixpkgs.lib.genAttrs supportedSystems (
          system:
          f {
            pkgs = import nixpkgs { inherit system; };
          }
        );
    in
    {
      devShells = forEachSupportedSystem (
        { pkgs }:
        {
          default = pkgs.mkShell.override { } {
            buildInputs = with pkgs; [
              nodejs_22
            ];
            hardeningDisable = [ "all" ];
            packages = with pkgs; [
              typescript-language-server
              pnpm
              nixd
              nixfmt-rfc-style
            ];
          };
        }
      );
    };
}
