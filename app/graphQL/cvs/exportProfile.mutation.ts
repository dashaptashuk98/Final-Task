import { gql } from "graphql-tag";

export const ExportPdf = gql`
  mutation ExportPdf($pdf: ExportPdfInput!) {
    exportPdf(pdf: $pdf)
  }
`;
