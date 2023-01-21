class Sighting {
    id: number;
    speciesEntries: Array<SpeciesEntry>
    latitude: number;
    longitude: number;
    locationComment: string;
+ images: List<Image>
+ detailsDate: Date
+ detailsMethod: EvidenceMethod
+ detailsComment: String
+ isDraft: Bool

}
