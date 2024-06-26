import { NextFunction, Request, Response } from "express";
import { Recipe } from "../interfaces";
import {
    fetchRecipes,
    fetchRecipeById,
    fetchRecipesByUserId,
    insertRecipe,
    updateRecipeById,
    removeRecipeById,
} from "../models/recipes-model";

export const getRecipes = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const recipes: Recipe[] = await fetchRecipes();
        res.status(200).send({ recipes });
    } catch (err) {
        return next(err);
    }
};

export const getRecipeById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { recipe_id } = req.params;
    try {
        const recipe: Recipe = await fetchRecipeById(+recipe_id);
        res.status(200).send({ recipe });
    } catch (err) {
        return next(err);
    }
};

export const getRecipesByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { user_id } = req.params;
    try {
        const recipes: Recipe[] = await fetchRecipesByUserId(+user_id);
        res.status(200).send({ recipes });
    } catch (err) {
        return next(err);
    }
};

export const postRecipe = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { user_id } = req.params;
        const payload: Recipe = { maker_id: user_id, ...req.body };
        const recipe: Recipe = await insertRecipe(payload);
        res.status(201).send({ recipe });
    } catch (err) {
        return next(err);
    }
};

export const patchRecipeById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { recipe_id } = req.params;
        const patchObject: { [index: string]: any } = req.body;
        const recipe: Recipe = await updateRecipeById(+recipe_id, patchObject);
        res.status(200).send({ recipe });
    } catch (err) {
        return next(err);
    }
};

export const deleteRecipeById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { recipe_id } = req.params;
    try {
        await removeRecipeById(+recipe_id);
        res.status(204).send();
    } catch (err) {
        return next(err);
    }
};